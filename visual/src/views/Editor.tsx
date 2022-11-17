import React from "react";

import { MainView } from "charticulator/src/app/main_view";
import { AppStore, Migrator } from "charticulator/src/app/stores";
import { makeDefaultDataset } from "charticulator/src/app/default_dataset";
import {
    CharticulatorWorker,
    CharticulatorWorkerInterface,
} from "charticulator/src/worker";
import {
    deepClone,
    Prototypes,
    Specification,
} from "charticulator/src/core/index";
import { CharticulatorAppConfig } from "charticulator/src/app/config";
import { Actions, NestedEditorData } from "charticulator/src/app";
import { MappingType } from "charticulator/src/core/specification";
import { Dataset } from "charticulator/src/core";
import { defaultVersionOfTemplate } from "charticulator/src/app/stores/defaults";
import { EditorType } from "charticulator/src/app/stores/app_store";
import {
    NestedEditorEventType,
    NestedEditorMessage,
    NestedEditorMessageType,
} from "charticulator/src/app/application";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    onSave: (chart: {
        chart: Specification.Chart,
        template: Specification.Template.ChartTemplate
    }) => void;
    onClose: () => void;
    onExport: (template: Specification.Template.ChartTemplate, clipboard: boolean) => void;
    onImport: () => Promise<Specification.Chart>;
}

export const Editor: React.FC<EditorProps> = ({
    width,
    chart,
    height,
    dataset,
    onSave,
    onClose,
    onExport,
    onImport
}) => {
    const [appStore, setAppStore] = React.useState<AppStore | null>(null);
    const config: CharticulatorAppConfig = React.useMemo(
        () => charticulatorConfig,
        [charticulatorConfig]
    );
    const workerScript = React.useMemo(() => {
        const blob = new Blob([script.default], { type: "application/javascript" });

        const workerScript = URL.createObjectURL(blob);

        return workerScript;
    }, [script]);

    const defaultDataset = React.useMemo(() => {
        const defaultDataset = makeDefaultDataset();
        defaultDataset.tables[0].name = "main";
        return defaultDataset;
    }, []);

    const setupCallback = React.useCallback(
        (appStore: AppStore) => (data: NestedEditorData) => {
            const info: NestedEditorData = data;
            if (info.specification && info.specification.mappings) {
                info.specification.mappings.width = {
                    type: MappingType.value,
                    value: info.width,
                } as Specification.ValueMapping;
                info.specification.mappings.height = {
                    type: MappingType.value,
                    value: info.height,
                } as Specification.ValueMapping;
            }
            if (!appStore) {
                return;
            }

            appStore.dispatcher.dispatch(
                new Actions.ImportChartAndDataset(
                    info.specification,
                    info.dataset,
                    {
                        filterCondition: info.filterCondition,
                    },
                    info.originSpecification
                )
            );
            if (onClose) {
                appStore.addListener(AppStore.EVENT_NESTED_EDITOR_CLOSE, () => {
                    onClose();
                });
            }

            appStore.setupNestedEditor((chart) => {
                const template = deepClone(appStore.buildChartTemplate());
                onSave({
                    chart,
                    template,
                });
            }, EditorType.Embedded);
        },
        []
    );

    React.useEffect(() => {
        (async () => {
            const worker: CharticulatorWorkerInterface = new CharticulatorWorker(
                workerScript
            );
            // worker should be initialized before creating appstore
            await worker.initialize(config);
            const appStore = new AppStore(worker, dataset || defaultDataset);
            appStore.editorType = EditorType.Embedded;

            setupCallback(appStore)({
                template: null,
                height,
                width,
                type: NestedEditorEventType.Load,
                dataset: dataset,
                id: "1",
                specification: chart,
                originSpecification: chart,
                filterCondition: null,
            });
            setAppStore(appStore);
        })();
    }, [config]);

    if (!appStore) {
        return null;
    }
    return (
        <>
            <MainView
                store={appStore}
                // ref={mainView}
                viewConfiguration={config.MainView}
                menuBarHandlers={{
                    onContactUsLink: () => { },
                    onCopyToClipboardClick: () => {
                        const template = deepClone(appStore.buildChartTemplate());
                        onExport(template, true);},
                    onExportTemplateClick: () => {
                        const template = deepClone(appStore.buildChartTemplate());
                        onExport(template, false);
                    },
                    onImportTemplateClick: async () => {
                        const specification = await onImport();
                        console.log(specification);
                        appStore.dispatcher.dispatch(
                            new Actions.ImportChartAndDataset(
                              specification,
                              dataset,
                              {
                                filterCondition: null,
                              },
                              specification
                            )
                          );
                    },
                }}
                tabButtons={null}
                telemetry={{
                    record: () => { },
                }}
            />
        </>
    );
};

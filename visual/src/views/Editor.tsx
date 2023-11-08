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
    defaultDigitsGroup,
    Specification,
} from "charticulator/src/core/index";
import { CharticulatorAppConfig, MainViewConfig } from "charticulator/src/app/config";
import { Actions, NestedEditorData } from "charticulator/src/app";
import { MappingType } from "charticulator/src/core/specification";
import { Dataset } from "charticulator/src/core";
// import { defaultVersionOfTemplate } from "charticulator/src/app/stores/defaults";
import { EditorType } from "charticulator/src/app/stores/app_store";

import { PositionsLeftRight, PositionsLeftRightTop, UndoRedoLocation } from 'charticulator/src/app/main_view';

import {
    NestedEditorEventType,
    // NestedEditorMessage,
    // NestedEditorMessageType,
} from "charticulator/src/app/application";
import { LocalizationConfig } from "charticulator/src/container/container";
import { useAppSelector } from "../redux/hooks";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    onSave: (chart: {
        chart: Specification.Chart,
        template: Specification.Template.ChartTemplate
    }) => void;
    localizaiton?: LocalizationConfig,
    utcTimeZone: boolean,
    onClose: () => void;
    onExport?: (template: Specification.Template.ChartTemplate, clipboard: boolean) => void;
    onImport?: () => Promise<Specification.Chart>;
}

export const Editor: React.FC<EditorProps> = ({
    localizaiton,
    utcTimeZone,
    onSave,
    onClose,
    onExport,
    onImport
}) => {
    console.log('Editor');
    const settings = useAppSelector((store) => store.visual.settings);
    const template = useAppSelector((store) => store.visual.template);
    const dataset = useAppSelector((store) => store.visual.dataset);
    // const { height, width } = useAppSelector((store) => store.visual.viewport);
    // const mapping = useAppSelector((store) => store.visual.mapping);

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

    React.useEffect(() => {
        (async () => {
            const worker: CharticulatorWorkerInterface = new CharticulatorWorker(
                workerScript
            );
            // worker should be initialized before creating appstore
            await worker.initialize(config);
            const appStore = new AppStore(worker, dataset || defaultDataset);
            appStore.editorType = EditorType.Embedded;

            if (appStore) {
                setAppStore(appStore);
                appStore.setLocaleFileFormat({
                    currency: localizaiton.currency,
                    delimiter: localizaiton.decemalDelimiter,
                    group: `[${defaultDigitsGroup}, 0]`,
                    numberFormat: {
                        decimal: localizaiton.decemalDelimiter,
                        remove: localizaiton.thousandsDelimiter,
                    },
                    utcTimeZone: utcTimeZone,
                });
                if (template && dataset) {
                    appStore.dispatcher.dispatch(
                        new Actions.ImportChartAndDataset(
                            deepClone(template.specification),
                            deepClone(dataset),
                            {
                                filterCondition: null,
                            },
                            deepClone(template.specification)
                        )
                    );
                    appStore.solveConstraintsAndUpdateGraphics(false);
                }
            }
        })();
    }, [config]);

    if (!appStore) {
        return null;
    }
    return (
        <>
            <MainView
                store={appStore}
                viewConfiguration={
                    {
                        ColumnsPosition: settings.panels.defaultDatasetPanelPosition as PositionsLeftRight,
                        EditorPanelsPosition: settings.panels.defaultPanelsPosition as PositionsLeftRight,
                        ToolbarPosition: PositionsLeftRightTop.Top,
                        ToolbarLabels: true,
                        Name: "Charticulator (Community version)",
                        MenuBarButtons: PositionsLeftRight.Right,
                        MenuBarSaveButtons: PositionsLeftRight.Left,
                        UndoRedoLocation: UndoRedoLocation.ToolBar
                    }
                }
                menuBarHandlers={{
                    onContactUsLink: () => { },
                    onCopyToClipboardClick: () => {
                        const template = deepClone(appStore.buildChartTemplate());
                        onExport(template, true);
                    },
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
                    }
                }}
                tabButtons={null}
                telemetry={{
                    record: () => { },
                }}
            />
        </>
    );
};

import React from "react";

import "./../../style/editor.less";

import { MainView } from "charticulator/src/app/main_view";
import { AppStore } from "charticulator/src/app/stores";
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
import { Actions } from "charticulator/src/app";
import { Dataset } from "charticulator/src/core";
// import { defaultVersionOfTemplate } from "charticulator/src/app/stores/defaults";
import { EditorType } from "charticulator/src/app/stores/app_store";

import { PositionsLeftRight, PositionsLeftRightTop, UndoRedoLocation } from './../../charticulator/src/app/main_view';

import { LocalizationConfig } from "charticulator/src/container/container";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setProperty, setTemplate } from "../redux/slices/visualSlice";
import { FluentProvider, Toaster, teamsLightTheme, useId, useToastController } from "@fluentui/react-components";

import {
    ToastLayout
} from "./ToastLayout";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const charticulatorConfig = require("json-loader!../../charticulator/dist/scripts/config.json");

export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    // onSave: (chart: {
    //     chart: Specification.Chart,
    //     template: Specification.Template.ChartTemplate
    // }) => void;
    localization?: LocalizationConfig,
    utcTimeZone: boolean,
    onClose: () => void;
    onExport?: (template: Specification.Template.ChartTemplate, clipboard: boolean) => void;
    onSupportDev?: () => void;
    onImport?: () => Promise<string>;
    onContactUsLink?: () => void;
    onGettingStartedClick?: () => void;
    onGalleryClick?: () => void;
    onIssuesClick?: () => void;
    onHomeClick?: () => void;
}

// eslint-disable-next-line max-lines-per-function
export const Editor: React.FC<EditorProps> = ({
    localization,
    utcTimeZone,
    onContactUsLink,
    onExport,
    onImport,
    onSupportDev,
    onGalleryClick,
    onHomeClick,
    onIssuesClick,
    onGettingStartedClick,
}) => {
    // console.log('Editor');
    const settings = useAppSelector((store) => store.visual.settings);
    const template = useAppSelector((store) => store.visual.template);
    // console.log('editor template', template);
    const dataset = useAppSelector((store) => store.visual.dataset);
    // const { height, width } = useAppSelector((store) => store.visual.viewport);
    // const mapping = useAppSelector((store) => store.visual.mapping);
    const dispatch = useAppDispatch();


    const [appStore, setAppStore] = React.useState<AppStore | null>(null);
    const config: CharticulatorAppConfig = React.useMemo(
        () => charticulatorConfig,
        []
    );
    const workerScript = React.useMemo(() => {
        const blob = new Blob([script.default], { type: "application/javascript" });

        const workerScript = URL.createObjectURL(blob);

        return workerScript;
    }, [script.default]);

    const defaultDataset = React.useMemo(() => {
        const defaultDataset = makeDefaultDataset();
        defaultDataset.tables[0].name = "main";
        return defaultDataset;
    }, []);
    
    const chartSavedToasterId = useId("chartSavedToaster");
    const { dispatchToast, dismissToast } = useToastController(chartSavedToasterId);

    React.useEffect(() => {
        let EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION = null;
        let appStore: AppStore = null;
        (async () => {
            const worker: CharticulatorWorkerInterface = new CharticulatorWorker(
                workerScript
            );
            // worker should be initialized before creating appstore
            await worker.initialize({
                ...config,
                localization: localization
            });
            appStore = new AppStore(worker, dataset || defaultDataset);
            appStore.editorType = EditorType.Embedded;

            if (appStore) {
                setAppStore(appStore);
                appStore.setLocaleFileFormat({
                    currency: localization.currency,
                    delimiter: localization.decemalDelimiter,
                    group: `[${defaultDigitsGroup}, 0]`,
                    numberFormat: {
                        decimal: localization.decemalDelimiter,
                        remove: localization.thousandsDelimiter,
                    },
                    utcTimeZone: utcTimeZone,
                    billionsFormat: localization.billionsFormat
                });
                if (template && dataset) {
                    // TODO fix loading chart with mapped columns
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
                // when appStore.editorType = EditorType.Embedded appStore fires EVENT_NESTED_EDITOR_EDIT
                EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION = appStore.addListener(AppStore.EVENT_NESTED_EDITOR_EDIT, () => {
                    const template = deepClone(appStore.buildChartTemplate());
                    const templateString = JSON.stringify(template);
                    dispatch(setTemplate(templateString));
                    dispatch(setProperty({
                        objectName: 'chart',
                        objectProperty: 'template',
                        value: JSON.stringify(template)
                    }));
                    dispatchToast(
                        React.createElement(ToastLayout, {
                            message: "Chart saved",
                            title: "Success",
                            subtitle: "Chart saved successfully",
                            onDismiss: () => {
                                dismissToast(chartSavedToasterId);
                            }
                        }), {intent: "success", timeout: 3000, toastId: chartSavedToasterId })
                });
            }
        })();
        return () => {
            if (appStore && EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION) {
                appStore.removeSubscription(EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION);
            }
        }
    }, [config]);

    if (!appStore) {
        return null;
    }
    return (
        <>
            <FluentProvider theme={teamsLightTheme}>
                <Toaster toasterId={chartSavedToasterId} />
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
                        onContactUsLink: onContactUsLink,
                        onCopyToClipboardClick: () => {
                            const template = deepClone(appStore.buildChartTemplate());
                            onExport(template, true);
                        },
                        onExportTemplateClick: () => {
                            const template = deepClone(appStore.buildChartTemplate());
                            onExport(template, false);
                        },
                        onSupportDevClick: onSupportDev,
                        onGalleryClick: onGalleryClick,
                        onHomeClick: onHomeClick,
                        onIssuesClick: onIssuesClick,
                        onGettingStartedClick: onGettingStartedClick,
                        onImportTemplateClick: async () => {
                            // TODO refactor
                            const specification = await onImport();
                            const parsed = JSON.parse(specification);
                            // console.log(specification);
                            appStore.dispatcher.dispatch(
                                new Actions.ImportChartAndDataset(
                                    parsed.specification,
                                    dataset,
                                    {
                                        filterCondition: null,
                                    },
                                    parsed.specification
                                )
                            );
                        }
                    }}
                    tabButtons={null}
                    telemetry={{
                        record: () => { },
                    }}
                />
            </FluentProvider>
        </>
    );
};

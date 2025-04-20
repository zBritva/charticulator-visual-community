/* eslint-disable powerbi-visuals/insecure-random */
/* eslint-disable max-lines-per-function */
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
    hexToRgb,
    Prototypes,
    Specification,
    uuid,
} from "charticulator/src/core/index";
import { CharticulatorAppConfig, MainViewConfig } from "charticulator/src/app/config";
import { Actions } from "charticulator/src/app";
import { Dataset } from "charticulator/src/core";
// import { defaultVersionOfTemplate } from "charticulator/src/app/stores/defaults";
import { EditorType } from "charticulator/src/app/stores/app_store";

import { PositionsLeftRight, PositionsLeftRightTop, UndoRedoLocation } from './../../charticulator/src/app/main_view';

import { LocalizationConfig } from "charticulator/src/container/container";
import { FluentProvider, Toaster, useId, useToastController, Theme } from "@fluentui/react-components";

import {
    ToastLayout
} from "./ToastLayout";
import { NestedChartEditorOptions } from "charticulator/src/core/prototypes/controls";
import { AttributeMap } from "charticulator/src/core/specification";
import { IVisualSettings } from "../settings";
import { ChartTemplateBuilder } from "charticulator/src/app/template";
import { CDNBackend } from "charticulator/src/app/backend/cdn";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setEditorStore } from "../redux/slices/visualSlice";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const containerScript = require("raw-loader!charticulator/dist/scripts/container.bundle.js");

const charticulatorConfig: CharticulatorAppConfig = require("json-loader!../../charticulator/dist/scripts/config.json");

export interface EditorProps {
    instanceID: string;
    // width?: number;
    // height?: number;
    // chart?: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    // onSave: (chart: {
    //     chart: Specification.Chart,
    //     template: Specification.Template.ChartTemplate
    // }) => void;
    localization?: LocalizationConfig,
    backgroundColor?: string,
    theme?: Partial<Theme>,
    utcTimeZone: boolean,

    settings?: IVisualSettings,
    template?: Specification.Template.ChartTemplate;

    isNestedEditor?: boolean;
    nestedEditorOptions?: NestedChartEditorOptions;
    name?: string;

    onClose?: () => void;
    onExport?: (name: string, template: string, clipboard: boolean, filetype: string) => void;
    onSupportDev?: () => void;
    onImport?: () => Promise<string>;
    onContactUsLink?: () => void;
    onGettingStartedClick?: () => void;
    onGalleryClick?: () => void;
    onIssuesClick?: () => void;
    onHomeClick?: () => void;
    onAboutClick?: () => void;


    setTemplate?: (template: string | Specification.Template.ChartTemplate, specification: Specification.Chart) => void;
    setProperty?: (property: { objectName: string, objectProperty: string, value: any }) => void;
    onWebAccessStatus?: () => Promise<boolean>;
}

interface NestedChartStack {
    options: NestedChartEditorOptions,
    object: Specification.IObject<AttributeMap>,
    property: Prototypes.Controls.Property,
    template: Specification.Template.ChartTemplate,
}

// eslint-disable-next-line max-lines-per-function
export const Editor: React.FC<EditorProps> = ({
    instanceID,
    localization,
    utcTimeZone,
    isNestedEditor,
    onContactUsLink,
    onExport,
    onImport,
    onSupportDev,
    onGalleryClick,
    onHomeClick,
    onIssuesClick,
    onAboutClick,
    onGettingStartedClick,
    onClose,
    setTemplate,
    setProperty,
    onWebAccessStatus,
    dataset,
    settings,
    template,
    name,
    theme
}) => {
    const nestedChartStack = React.useRef<NestedChartStack>(null);
    const exportAllowed = useAppSelector((store) => store.visual.exportAllowed);
    
    const backgroundColor = useAppSelector((store) => {
        if (store.visual.settings.colors.updateColors) {
            store.visual.host.colorPalette.background.value
        }
        return null;
    });

    const dispatch = useAppDispatch();

    const [nestedEditorId, setNestedEditorId] = React.useState<string>(null);

    const [appStore, setAppStore] = React.useState<AppStore | null>(null);
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
        let EVENT_OPEN_NESTED_EDITOR_SUBSCRIPTION = null;
        let EVENT_NESTED_EDITOR_CLOSE_SUBSCRIPTION = null;
        let appStore: AppStore = null;
        (async () => {
            const worker: CharticulatorWorkerInterface = new CharticulatorWorker(
                workerScript
            );
            // worker should be initialized before creating appstore
            await worker.initialize({
                ...charticulatorConfig,
                localization: localization
            });

            let backend = null;
            if (await onWebAccessStatus()) {
                backend = new CDNBackend({
                    resourcesDescriptionUrl: "https://ilfat-galiev.im/charts.json",
                    createUrl: null,
                    deleteUrl: null,
                    updateUrl: null
                })
            }

            appStore = new AppStore(worker, dataset || defaultDataset, backend);
            appStore.ContainerScriptText = containerScript.default;
            if (isNestedEditor) {
                appStore.editorType = EditorType.NestedEmbedded;
            } else {
                appStore.editorType = EditorType.Embedded;
            }

            if (appStore) {
                setAppStore(appStore);
                dispatch(setEditorStore(appStore));
                appStore.setLocaleFileFormat({
                    currency: localization.currency,
                    delimiter: localization.decimalDelimiter,
                    group: `[${defaultDigitsGroup}, 0]`,
                    numberFormat: {
                        decimal: localization.decimalDelimiter,
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
                    console.log('EVENT_NESTED_EDITOR_EDIT', instanceID);
                    const template = deepClone(appStore.buildChartTemplate());
                    const specification = appStore.chart;

                    const templateString = JSON.stringify(template);
                    setTemplate(template, specification);

                    setProperty({
                        objectName: 'chart',
                        objectProperty: 'template',
                        value: templateString
                    });

                    dispatchToast(
                        React.createElement(ToastLayout, {
                            message: "Chart saved",
                            title: "Success",
                            subtitle: "Chart saved successfully",
                            onDismiss: () => {
                                dismissToast(chartSavedToasterId);
                            }
                        }), { intent: "success", timeout: 3000, toastId: chartSavedToasterId })
                });

                EVENT_OPEN_NESTED_EDITOR_SUBSCRIPTION = appStore.addListener(AppStore.EVENT_OPEN_NESTED_EDITOR, (
                    options: NestedChartEditorOptions,
                    object: Specification.IObject<AttributeMap>,
                    property: Prototypes.Controls.Property
                ) => {
                    const chartManager = new Prototypes.ChartStateManager(
                        options.specification,
                        options.dataset,
                        null,
                        {},
                        {}
                    )

                    const builder = new ChartTemplateBuilder(
                        options.specification,
                        options.dataset,
                        chartManager,
                        CHARTICULATOR_PACKAGE.version
                    );

                    const template = builder.build();

                    const nestedEditorId = uuid();

                    nestedChartStack.current = {
                        options,
                        object,
                        property,
                        template
                    };

                    setNestedEditorId(nestedEditorId);
                });

                EVENT_NESTED_EDITOR_CLOSE_SUBSCRIPTION = appStore.addListener(AppStore.EVENT_NESTED_EDITOR_CLOSE, () => {
                    console.log('EVENT_NESTED_EDITOR_CLOSE', instanceID);
                    onClose();
                });

                // export on menu
                appStore.onExportTemplate((type: string, content: Blob) => {
                    content.text().then(text => {
                        const name = template.specification.properties.name;
                        onExport(name, text, !exportAllowed, type);
                    })
                    return true;
                });
            }
        })();
        return () => {
            if (appStore && EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION) {
                appStore.removeSubscription(EVENT_NESTED_EDITOR_EDIT_SUBSCRIPTION);
            }
            if (appStore && EVENT_OPEN_NESTED_EDITOR_SUBSCRIPTION) {
                appStore.removeSubscription(EVENT_OPEN_NESTED_EDITOR_SUBSCRIPTION);
            }
            if (appStore && EVENT_NESTED_EDITOR_CLOSE_SUBSCRIPTION) {
                appStore.removeSubscription(EVENT_NESTED_EDITOR_CLOSE_SUBSCRIPTION);
            }
            if (appStore) {
                appStore.destroy();
            }
        }
    }, [charticulatorConfig]);

    if (!appStore) {
        return null;
    }

    return (
        <React.Fragment>
            {nestedEditorId && nestedChartStack.current && nestedChartStack.current.options != null ?
            (<>
                <Editor
                    theme={theme}
                    instanceID={nestedEditorId}
                    // eslint-disable-next-line powerbi-visuals/insecure-random
                    key={"nestedEditor " + (nestedEditorId)}
                    isNestedEditor={nestedChartStack.current.options != null}
                    template={nestedChartStack.current.template}
                    nestedEditorOptions={nestedChartStack.current.options}
                    dataset={nestedChartStack.current.options.dataset}
                    localization={localization}
                    columnMappings={settings.chart.columnMappings as any}
                    utcTimeZone={settings.localization.utcTimeZone}
                    onExport={onExport}
                    onImport={async () => {
                        return "";
                    }}
                    name=" "
                    onSupportDev={onSupportDev}
                    onContactUsLink={onContactUsLink}
                    onGalleryClick={onGalleryClick}
                    onGettingStartedClick={onGettingStartedClick}
                    onHomeClick={onHomeClick}
                    onAboutClick={onAboutClick}
                    onIssuesClick={onIssuesClick}
                    settings={settings}
                    setTemplate={(template, specification) => {
                        if (typeof specification === 'object') {
                            appStore.setProperty({
                                object: nestedChartStack.current.object,
                                property: nestedChartStack.current.property.property,
                                field: nestedChartStack.current.property.field,
                                value: specification,
                                noUpdateState: nestedChartStack.current.property.noUpdateState,
                                noComputeLayout: nestedChartStack.current.property.noComputeLayout,
                            });
                        }
                    }}
                    setProperty={() => {
                        // supress 
                    }}
                    onClose={() => {
                        setNestedEditorId(null);
                        nestedChartStack.current = null;
                        appStore.emit(AppStore.EVENT_GRAPHICS);
                    }}
                    onWebAccessStatus={onWebAccessStatus}
                    backgroundColor={backgroundColor}
                />
            </>) :
            (<>
                <FluentProvider theme={theme}>
                    <Toaster toasterId={chartSavedToasterId} />
                    <MainView
                        key={"MainView " + (Math.random())}
                        theme={theme}
                        store={appStore}
                        backgroundColor={hexToRgb(backgroundColor)}
                        viewConfiguration={{
                            ColumnsPosition: settings.panels.defaultDatasetPanelPosition as PositionsLeftRight,
                            EditorPanelsPosition: settings.panels.defaultPanelsPosition as PositionsLeftRight,
                            ToolbarPosition: PositionsLeftRightTop.Top,
                            ToolbarLabels: true,
                            Name: name || "Charticulator (Community version)",
                            MenuBarButtons: PositionsLeftRight.Right,
                            MenuBarSaveButtons: PositionsLeftRight.Left,
                            UndoRedoLocation: UndoRedoLocation.ToolBar
                        }}
                        menuBarHandlers={{
                            onContactUsLink: onContactUsLink,
                            onCopyToClipboardClick: () => {
                                const template = deepClone(appStore.buildChartTemplate());
                                onExport(template.specification.properties?.name || "template" , JSON.stringify(template, null, " "), true, "json");
                            },
                            // onExportTemplateClick: () => {
                            //     const template = deepClone(appStore.buildChartTemplate());
                            //     onExport(template, false);
                            // },
                            onSupportDevClick: onSupportDev,
                            onGalleryClick: onGalleryClick,
                            onHomeClick: onHomeClick,
                            onIssuesClick: onIssuesClick,
                            onGettingStartedClick: onGettingStartedClick,
                            onImportTemplateClick: async () => {
                                try {
                                    const specification = await onImport();
                                    const parsed = JSON.parse(specification);
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
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }}
                    />
                </FluentProvider>
            </>)}
        </React.Fragment>
    );
};

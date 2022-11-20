import React from 'react';

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { Editor } from './Editor';
import { ChartViewer, IModifiers } from './ChartViewer';
// import { Mapping } from "./Mapping"
// import { Tutorial } from "./Tutorial"
import { VisualSettings } from '../settings';
// import { checkColumns, applyMapping, updateDataValues, colorKey, defaultDompurifyConfig } from "./utils";
// import { convertPointToTooltip } from "./tooltiputils";
// import { strings } from './strings';
import { convertData } from './../utils/dataParser';
import { ChartTemplate, Dataset, defaultDigitsGroup } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
import { copyToClipboard, readFileAsString } from 'charticulator/src/app/utils';
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

import {
    setFormatOptions,
} from "charticulator/src/core/index";
import { PositionsLeftRight, PositionsLeftRightTop, UndoRedoLocation } from 'charticulator/src/app/main_view';

export interface ApplicationProps {
    host: powerbi.extensibility.visual.IVisualHost
}

export interface ApplicationPropsRef {
    setOptions: (option: VisualUpdateOptions) => void;
}


// tslint:disable-next-line
const ApplicationContainer: React.ForwardRefRenderFunction<ApplicationPropsRef, ApplicationProps> = ({host}: ApplicationProps, ref: React.ForwardedRef<ApplicationPropsRef>) => {

    const [solverInitialized, setInitialization] = React.useState<boolean>(false);

    const [option, setOptions] = React.useState<VisualUpdateOptions | null>(null);
    if (option) {
        host.eventService.renderingStarted(option);
    }

    const parseSettings = React.useCallback((dataView: powerbi.DataView | undefined): VisualSettings | undefined => {
        if (dataView) {
            return VisualSettings.parse(dataView) as VisualSettings;
        }
    }, [option]);

    const persistProperty = React.useCallback((json_string: string) => {
        const instance: powerbi.VisualObjectInstance = {
            objectName: "chart",
            selector: {},
            properties: {
                template: json_string
            }
        };

        host.persistProperties({
            merge: [
                instance
            ]
        });
    }, [host]);

    const onSave = React.useCallback(({
        template,
    }: any) => {
        const chartJSON = JSON.stringify(template);
        persistProperty(chartJSON);
    }, [persistProperty]);

    const selectionManager = React.useMemo(() => {
        return host.createSelectionManager();
    }, [host]);
    

    const selectionBuilderCreator = React.useMemo(() => {
        return () => host.createSelectionIdBuilder();
    }, [host]);

    React.useEffect(() => {
        (async () => {
            await initialize(charticulatorConfig);
            setInitialization(true);
            setFormatOptions({
                currency: [localizaiton?.currency, ""],
                grouping: defaultDigitsGroup,
                decimal: localizaiton?.decemalDelimiter,
                thousands:
                  localizaiton?.thousandsDelimiter,
              });

            if (option) {
                host.eventService.renderingFinished(option);
            }
        })();
    }, [setInitialization]);

    React.useImperativeHandle(ref, () => ({
        setOptions: (option: VisualUpdateOptions) => setOptions(option)
    }));

    // conver data from Power BI to internal structure
    const settings = parseSettings(option?.dataViews[0]);
    const dataView = option?.dataViews[0];
    const template = settings && settings.chart?.template;
    const [dataset, selections] = React.useMemo(() => convertData(dataView, selectionBuilderCreator), [dataView, selectionBuilderCreator]);
    const localizaiton = React.useMemo(() => ({
        currency: settings?.localization.currency,
        decemalDelimiter: settings?.localization.decemalDelimiter,
        thousandsDelimiter: settings?.localization.thousandsDelimiter
    }), [settings]);


    const createChartFromTemplate = React.useCallback((template: string, dataset: Dataset.Dataset) => {
        const chartJSON = JSON.parse(template);
        const chartTemplate = new ChartTemplate(
            chartJSON
        );

        const chartTables = chartJSON.tables;

        chartTables.forEach((table: any) => {
        chartTemplate.assignTable(
            table.name,
            table.name
        );
        table.columns.forEach((column: any) => {
            chartTemplate.assignColumn(
            table.name,
            column.name,
            column.name
            );
        })
        });

        const instance = chartTemplate.instantiate(dataset);
        const { chart } = instance;

        return chart;
    }, []);

    const onSelect = React.useCallback((table: string, rowIndices: number[], modifiers?: IModifiers) => {
        // TODO handle selection
        selectionManager.select(rowIndices.map(index => selections.get(index)).filter(s => s), modifiers?.ctrlKey); // TODO check meta for MacOS
    }, [dataView, selections]);

    const onContextMenu = React.useCallback((table: string, rowIndices: number[], modifiers: IModifiers) => {
        // TODO handle selection
        selectionManager.showContextMenu(
            rowIndices.map(index => selections.get(index)).filter(s => s),
            {
                x: modifiers.clientX, 
                y: modifiers.clientY
            }
        );
    }, [dataView, selections]);

    const importTempalte = React.useCallback(() => {
        return new Promise<any>((resolve, reject) => {
            const inputElement = document.createElement("input");
            inputElement.type = "file";
            let file: File = null;
            inputElement.accept = ["tmplt", "json"]
            .map((x) => "." + x)
            .join(",");
            // eslint-disable-next-line
            inputElement.onchange = async () => {
                if (inputElement.files.length == 1) {
                    file = inputElement.files[0];
                    if (file) {
                        try {
                            const template = await readFileAsString(file);
                            JSON.parse(template); // parse ensure that string is JSON
                            persistProperty(template);
                            const specification = createChartFromTemplate(template, dataset);
                            resolve(specification);
                        } catch (e) {
                            console.error(e);
                            reject();
                        }
                    }
                } else {
                    reject();
                }
            }
            inputElement.click();
        });
    }, [persistProperty, readFileAsString, dataset]); 

    if (!option || !solverInitialized) {
        return (<p>Loading...</p>)
    }

    if (option && option.editMode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({immediately: true, isTouchEvent: false});
        return (
            <>
                <Editor
                    width={option.viewport.width}
                    height={option.viewport.height}
                    chart={createChartFromTemplate(template, dataset)}
                    columnMappings={settings.chart.columnMappings as any}
                    dataset={dataset}
                    onSave={onSave}
                    localizaiton={localizaiton}
                    utcTimeZone={settings.localization.utcTimeZone}
                    mainView={{
                        ColumnsPosition: settings.panels.defaultDatasetPanelPosition as PositionsLeftRight,
                        EditorPanelsPosition:  settings.panels.defaultPanelsPosition as PositionsLeftRight,
                        ToolbarPosition: PositionsLeftRightTop.Top,
                        ToolbarLabels: true,
                        Name: "Charticulator (Community version)",
                        MenuBarButtons: PositionsLeftRight.Right,
                        MenuBarSaveButtons: PositionsLeftRight.Left,
                        UndoRedoLocation: UndoRedoLocation.ToolBar
                    }}
                    onClose={() => {

                    }}
                    onExport={async (template, clipboard) => {
                        const json = JSON.stringify(template);
                        if (clipboard) {
                            try {
                                const clipboardPermissions = await navigator.permissions.query({ name: 'clipboard-write' as any });
                                if (clipboardPermissions.state === 'granted') {
                                    window.focus();
                                    await navigator.clipboard.writeText(json);
                                } else {
                                    copyToClipboard(json);
                                }
                            } catch(e) {
                                console.error(e);
                            }
                        } else {
                            await host.downloadService.exportVisualsContent(json, `${template.specification._id}.json`, 'json', 'template');
                        }
                    }}
                    onImport={importTempalte}
                />
            </>
        );
    } else {

        return (
            <>
                <ChartViewer
                    width={option.viewport.width}
                    height={option.viewport.height}
                    chart={createChartFromTemplate(template, dataset)}
                    defaultAttributes={{}}    
                    dataset={dataset}
                    onSelect={onSelect}
                    onContextMenu={onContextMenu}
                    localizaiton={localizaiton}
                    utcTimeZone={settings.localization.utcTimeZone}
                />
            </>
        )
    }
}

export const Application = React.forwardRef(ApplicationContainer);

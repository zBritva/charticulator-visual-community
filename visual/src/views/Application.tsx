import React from 'react';

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { Editor } from './Editor';
import { IUnmappedColumns, Mapping, UnmappedColumnName } from './Mapping';
import { ChartViewer, IModifiers } from './ChartViewer';
import { Tutorial } from "./Tutorial";
import { VisualSettings } from '../settings';
import { convertData } from './../utils/dataParser';
import { ChartTemplate, ColorUtils, Dataset, defaultDigitsGroup } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
import { copyToClipboard, readFileAsString } from 'charticulator/src/app/utils';
import charticulatorConfig from "json-loader!./../../charticulator/dist/scripts/config.json";

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

    const persistProperty = React.useCallback((object: string, property: string, value: string) => {
        const instance: powerbi.VisualObjectInstance = {
            objectName: object,
            selector: null,
            properties: {
                [property]: value
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
        persistProperty('chart', 'template', chartJSON);
        persistProperty('chart', 'columnMappings', JSON.stringify(unmappedColumns));
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

            ColorUtils.setDefaultColorPaletteGenerator(key => ColorUtils.colorFromHTMLColor(host.colorPalette.getColor(key).value));
            ColorUtils.setDefaultColorGeneratorResetFunction(() => host.colorPalette.reset());

            if (option) {
                host.eventService.renderingFinished(option);
            }
        })();
    }, [setInitialization, setFormatOptions, initialize, host]);

    React.useImperativeHandle(ref, () => ({
        setOptions: (option: VisualUpdateOptions) => setOptions(option)
    }));

    // conver data from Power BI to internal structure
    const settings = parseSettings(option?.dataViews[0]);
    const dataView = option?.dataViews[0];
    const storedMappedColumns = (settings?.chart && JSON.parse(settings.chart.columnMappings)) ?? [];
    const template = settings && settings.chart?.template;
    const [dataset, selections] = React.useMemo(() => convertData(dataView, selectionBuilderCreator), [dataView, selectionBuilderCreator]);
    const localizaiton = React.useMemo(() => ({
        currency: settings?.localization.currency,
        decemalDelimiter: settings?.localization.decemalDelimiter,
        thousandsDelimiter: settings?.localization.thousandsDelimiter
    }), [settings]);

    const [unmappedColumns, setUnmappedColumn] = React.useState<IUnmappedColumns[]>(storedMappedColumns);

    const createChartFromTemplate = React.useCallback((template: string, dataset: Dataset.Dataset) => {
        const chartJSON = JSON.parse(template);
        const chartTemplate = new ChartTemplate(
            chartJSON
        );
        debugger;

        const chartTables = chartJSON.tables;
        const newUnmappedColumns: IUnmappedColumns[] = [];

        chartTables.forEach((table: any) => {
            chartTemplate.assignTable(
                table.name,
                table.name
            );

            const datasetTable = dataset.tables.find(t => table.type == t.type);

            table.columns.forEach((column: any) => {
                const datasetColumn =datasetTable?.columns.find(c => c.name === column.name || unmappedColumns.find(uc => uc.powerbiColumn == c.name))

                if (datasetColumn) {
                    chartTemplate.assignColumn(
                        table.name,
                        column.name,
                        datasetColumn.name
                    );
                } else {
                    newUnmappedColumns.push({
                        table: table.name,
                        tableType: table.type,
                        column: column.name,
                        columnType: column.type,
                        powerbiColumn: UnmappedColumnName
                    });
                }
            })
        });

        if (newUnmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length === 0) {
            const instance = chartTemplate.instantiate(dataset);
            const { chart } = instance;
            
            return chart;
        } else {
            setUnmappedColumn(newUnmappedColumns);
            return null;
        }
    }, [setUnmappedColumn, unmappedColumns]);

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
                            persistProperty('chart', 'template', template);
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

    if (!dataView) {
        return (<Tutorial />);
    }

    if (option && option.editMode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({immediately: true, isTouchEvent: false});
        const chart =createChartFromTemplate(template, dataset);
        if (chart) {
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
            return (<>
                <p>Chart is not loaded to editor...</p>
            </>);
        }
    } else {
        if (unmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length > 0) {
            return (
                <>
                    <Mapping
                        dataset={dataset}
                        unmappedColumns={unmappedColumns}
                        onConfirmMapping={(mappedColumns: IUnmappedColumns[]) => {
                            setUnmappedColumn(mappedColumns);
                            persistProperty('chart', 'columnMappings', JSON.stringify(mappedColumns));
                        }}
                    />
                </>
            );
        }
        const chart =createChartFromTemplate(template, dataset);
        if (chart) {
            return (
                <>
                    <ChartViewer
                        width={option.viewport.width}
                        height={option.viewport.height}
                        chart={chart}
                        defaultAttributes={{}}    
                        dataset={dataset}
                        onSelect={onSelect}
                        onContextMenu={onContextMenu}
                        localizaiton={localizaiton}
                        utcTimeZone={settings.localization.utcTimeZone}
                    />
                </>
            );
        } else {
            return (<>
                <p>Chart is not loaded...</p>
            </>);
        }
    }
}

export const Application = React.forwardRef(ApplicationContainer);

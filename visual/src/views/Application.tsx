import React from 'react';

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { Editor } from './Editor';
import { Mapping, UnmappedColumnName } from './Mapping';
import { ChartViewer, IModifiers } from './ChartViewer';
import { Tutorial } from "./Tutorial";
import { convertData } from './../utils/dataParser';
import { ChartTemplate, ColorUtils, Dataset, defaultDigitsGroup } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
import charticulatorConfig from "./../../../charticulator/dist/scripts/config.json";

import {
    setFormatOptions,
} from "charticulator/src/core/index";

import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setSolverInitialized, setProperty, setUnmappedColumn, IUnmappedColumns } from '../redux/slices/visualSlice';
import { useSelector } from 'react-redux';

// tslint:disable-next-line
export const Application: React.FC = () => {

    console.log('Application');
    const dataView = useAppSelector((store) => store.visual.dataview);
    const mode = useAppSelector((store) => store.visual.mode);
    const view = useAppSelector((store) => store.visual.view);
    const host = useAppSelector((store) => store.visual.host);
    const settings = useAppSelector((store) => store.visual.settings);
    const viewport = useAppSelector((store) => store.visual.viewport);
    const solverInitialized = useAppSelector((store) => store.visual.solverInitialized);
    const dispatch = useAppDispatch();

    if (dataView) {
        host.eventService.renderingStarted({});
    }

    const onSave = React.useCallback(({
        template,
    }: any) => {
        const chartJSON = JSON.stringify(template);
        dispatch(setProperty({
            objectName: 'chart', objectProperty: 'template', value: chartJSON
        }));
        dispatch(setProperty({
            objectName: 'chart', objectProperty: 'columnMappings', value: JSON.stringify(unmappedColumns)
        }));
    }, [setProperty]);

    const selectionManager = React.useMemo(() => {
        return host.createSelectionManager();
    }, [host]);

    const selectionBuilderCreator = React.useMemo(() => {
        return () => host.createSelectionIdBuilder();
    }, [host]);

    React.useEffect(() => {
        (async () => {
            await initialize(charticulatorConfig);
            dispatch(setSolverInitialized());
            setFormatOptions({
                currency: [localizaiton?.currency, ""],
                grouping: defaultDigitsGroup,
                decimal: localizaiton?.decemalDelimiter,
                thousands:
                    localizaiton?.thousandsDelimiter,
            });

            ColorUtils.setDefaultColorPaletteGenerator(key => ColorUtils.colorFromHTMLColor(host.colorPalette.getColor(key).value));
            ColorUtils.setDefaultColorGeneratorResetFunction(() => host.colorPalette.reset());

            if (dataView) {
                host.eventService.renderingFinished({});
            }
        })();
    }, [setSolverInitialized, setFormatOptions, initialize, host]);

    // conver data from Power BI to internal structure
    const storedMappedColumns = (settings?.chart && JSON.parse(settings.chart.columnMappings)) ?? [];
    const template = settings && settings.chart?.template;
    const [dataset, selections] = React.useMemo(() => convertData(dataView, selectionBuilderCreator), [dataView, selectionBuilderCreator]);
    const localizaiton = React.useMemo(() => ({
        currency: settings?.localization.currency,
        decemalDelimiter: settings?.localization.decemalDelimiter,
        thousandsDelimiter: settings?.localization.thousandsDelimiter
    }), [settings]);


    const unmappedColumns = useAppSelector((state) => state.visual.unmappedColumns);

    const createChartFromTemplate = React.useCallback((template: string, dataset: Dataset.Dataset) => {
        const chartJSON = JSON.parse(template);
        const chartTemplate = new ChartTemplate(
            chartJSON
        );

        const chartTables = chartJSON.tables;
        const newUnmappedColumns: IUnmappedColumns[] = [];
        // tweak tables for old templates
        if (chartTables[0] != undefined && chartTables[0]?.type === undefined) {
            chartTables[0].type = Dataset.TableType.Main;
        }
        if (chartTables[1] != undefined && chartTables[1].type === undefined) {
            chartTables[1].type = Dataset.TableType.Links;
        }

        chartTables.forEach((table: any) => {
            chartTemplate.assignTable(
                table.name,
                table.name
            );

            const datasetTable = dataset.tables.find(t => table.type == t.type);

            table.columns.forEach((column: any) => {
                const datasetColumn = datasetTable?.columns.find(c => c.name === column.name || unmappedColumns.find(uc => uc.powerbiColumn == c.name))

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
            dispatch(setUnmappedColumn(newUnmappedColumns));
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

    // const importTempalte = React.useCallback(() => {
    //     return new Promise<any>((resolve, reject) => {
    //         const inputElement = document.createElement("input");
    //         inputElement.type = "file";
    //         let file: File = null;
    //         inputElement.accept = ["tmplt", "json"]
    //             .map((x) => "." + x)
    //             .join(",");
    //         // eslint-disable-next-line
    //         inputElement.onchange = async () => {
    //             if (inputElement.files.length == 1) {
    //                 file = inputElement.files[0];
    //                 if (file) {
    //                     try {
    //                         const template = await readFileAsString(file);
    //                         JSON.parse(template); // parse ensure that string is JSON
    //                         setProperty({
    //                             objectName: 'chart', objectProperty: 'template', value: template
    //                         });
    //                         const specification = createChartFromTemplate(template, dataset);
    //                         resolve(specification);
    //                     } catch (e) {
    //                         console.error(e);
    //                         reject();
    //                     }
    //                 }
    //             } else {
    //                 reject();
    //             }
    //         }
    //         inputElement.click();
    //     });
    // }, [setProperty, readFileAsString, dataset]);

    if (!dataView || !solverInitialized) {
        return (<p>Loading...</p>)
    }

    if (!dataView) {
        return (<Tutorial openURL={(url: string) => host.launchUrl(url)} />);
    }

    if (dataView && mode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        const chart = createChartFromTemplate(template, dataset);
        if (chart) {
            return (
                <>
                    <Editor
                        width={viewport.width}
                        height={viewport.height}
                        chart={createChartFromTemplate(template, dataset)}
                        columnMappings={settings.chart.columnMappings as any}
                        dataset={dataset}
                        onSave={onSave}
                        localizaiton={localizaiton}
                        utcTimeZone={settings.localization.utcTimeZone}
                        // mainView={{
                        //     ColumnsPosition: settings.panels.defaultDatasetPanelPosition as PositionsLeftRight,
                        //     EditorPanelsPosition: settings.panels.defaultPanelsPosition as PositionsLeftRight,
                        //     ToolbarPosition: PositionsLeftRightTop.Top,
                        //     ToolbarLabels: true,
                        //     Name: "Charticulator (Community version)",
                        //     MenuBarButtons: PositionsLeftRight.Right,
                        //     MenuBarSaveButtons: PositionsLeftRight.Left,
                        //     UndoRedoLocation: UndoRedoLocation.ToolBar
                        // }}
                        onClose={() => {

                        }}
                        // onExport={async (template, clipboard) => {
                        //     const json = JSON.stringify(template);
                        //     if (clipboard) {
                        //         try {
                        //             const clipboardPermissions = await navigator.permissions.query({ name: 'clipboard-write' as any });
                        //             if (clipboardPermissions.state === 'granted') {
                        //                 window.focus();
                        //                 await navigator.clipboard.writeText(json);
                        //             } else {
                        //                 copyToClipboard(json);
                        //             }
                        //         } catch (e) {
                        //             console.error(e);
                        //         }
                        //     } else {
                        //         await host.downloadService.exportVisualsContent(json, `${template.specification._id}.json`, 'json', 'template');
                        //     }
                        // }}
                        // onImport={importTempalte}
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
                            setProperty({
                                objectName: 'chart', objectProperty: 'columnMappings', value: JSON.stringify(mappedColumns)
                            });
                        }}
                    />
                </>
            );
        }
        const chart = createChartFromTemplate(template, dataset);
        if (chart && viewport) {
            if (view === powerbi.ViewMode.View) {
                return (<>
                    <h4>This version of the visual doesn't support view mode</h4>
                    <p>Please switch the visual to view version before save the report</p>
                </>);
            }
            return (
                <>
                    <h4>Editor preview:</h4>
                    <ChartViewer
                        width={viewport.width}
                        height={viewport.height}
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

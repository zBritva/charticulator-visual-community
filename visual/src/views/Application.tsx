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
import { setSolverInitialized, setProperty, setMapping, IColumnsMapping, setTemplate } from '../redux/slices/visualSlice';
import { useSelector } from 'react-redux';
import { deepClone } from '../utils/main';
import { templateToChart } from '../utils/template';
import { importTempalte } from '../utils/importTemplate';


// tslint:disable-next-line
export const Application: React.FC = () => {

    console.log('Application');
    const dataView = useAppSelector((store) => store.visual.dataview);
    const dataset = useAppSelector((store) => store.visual.dataset);
    const selections = useAppSelector((store) => store.visual.selections);
    const mode = useAppSelector((store) => store.visual.mode);
    const view = useAppSelector((store) => store.visual.view);
    const host = useAppSelector((store) => store.visual.host);
    const settings = useAppSelector((store) => store.visual.settings);
    const viewport = useAppSelector((store) => store.visual.viewport);
    const solverInitialized = useAppSelector((store) => store.visual.solverInitialized);
    const chart = useAppSelector((store) => store.visual.chart);
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

    React.useEffect(() => {
        (async () => {
            await initialize(charticulatorConfig);
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
            dispatch(setSolverInitialized());
        })();
    }, [setSolverInitialized, setFormatOptions, initialize, host]);

    // conver data from Power BI to internal structure
    // const storedMappedColumns = (settings?.chart && JSON.parse(settings.chart.columnMappings)) ?? [];
    const localizaiton = React.useMemo(() => ({
        currency: settings?.localization.currency,
        decemalDelimiter: settings?.localization.decemalDelimiter,
        thousandsDelimiter: settings?.localization.thousandsDelimiter
    }), [settings]);

    const unmappedColumns = useAppSelector((state) => state.visual.unmappedColumns);

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

    const onImportTempalte = React.useCallback(async () => {
        const template = await importTempalte();
        dispatch(setTemplate(template));

        const { chart } = templateToChart(template, dataset, []);

        return chart;
    }, [setProperty]);

    if (!dataset || !solverInitialized) {
        return (<p>Loading...</p>)
    }

    if (!dataset) {
        return (<Tutorial openURL={(url: string) => host.launchUrl(url)} />);
    }

    if (dataset && mode === powerbi.EditMode.Advanced) {
        
        host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        // const chart = createChartFromTemplate(template, dataset);
        if (chart) {
            return (
                <>
                    <Editor
                        width={viewport.width}
                        height={viewport.height}
                        chart={chart}
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
                        onImport={onImportTempalte}
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
                        unmappedColumns={deepClone(unmappedColumns)}
                        onConfirmMapping={(mappedColumns: IColumnsMapping[]) => {
                            dispatch(setMapping(mappedColumns));
                            dispatch(setProperty({
                                objectName: 'chart', objectProperty: 'columnMappings', value: JSON.stringify(mappedColumns)
                            }));
                        }}
                    />
                </>
            );
        }
        // const chart = createChartFromTemplate(template, dataset);
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

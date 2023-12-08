import React from 'react';

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { Editor } from './Editor';
import { Mapping, UnmappedColumnName } from './Mapping';
import { ChartViewer, IModifiers } from './ChartViewer';
import { ColorUtils, defaultDigitsGroup, setTimeZone } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
import charticulatorConfig from "./../../../charticulator/dist/scripts/config.json";

import {
    setFormatOptions,
} from "charticulator/src/core/index";

import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setSolverInitialized, setProperty, setMapping, IColumnsMapping, setTemplate, importTemplate } from '../redux/slices/visualSlice';
import { deepClone, isEditor } from '../utils/main';
import { importTempalte } from '../utils/importTemplate';
import { FluentProvider, Label, Tooltip, makeStyles, shorthands, teamsLightTheme } from "@fluentui/react-components";

import switchVisual from "./../../assets/label_tip.png"

const useStyles = makeStyles({
    tooltipWidthClass: {
        maxWidth: '480px',
    },
    label: {
        marginBottom: '8px'
    },
    imageBorder: {
        ...shorthands.borderWidth('2px'),
        ...shorthands.borderColor('black'),
        ...shorthands.borderStyle('solid'),
    }
});

// tslint:disable-next-line
export const Application: React.FC = () => {

    // console.log('Application');
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
    const template = useAppSelector((store) => store.visual.template);
    const unmappedColumns = useAppSelector((state) => state.visual.unmappedColumns);
    const dispatch = useAppDispatch();

    const styles = useStyles();

    if (dataView) {
        host.eventService.renderingStarted({});
    }

    const onUrl = React.useCallback((url: string) => {
        return () => host.launchUrl(url);
    }, [host]);

    const selectionManager = React.useMemo(() => {
        return host.createSelectionManager();
    }, [host]);

    React.useEffect(() => {
        (async () => {
            await initialize(charticulatorConfig as unknown);
            setFormatOptions({
                currency: [localizaiton?.currency, ""],
                grouping: defaultDigitsGroup,
                decimal: localizaiton?.decemalDelimiter,
                thousands:
                    localizaiton?.thousandsDelimiter,
            });
            setTimeZone(settings.localization.utcTimeZone);

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


    const onSelect = React.useCallback(async (table: string, rowIndices: number[], modifiers?: IModifiers): Promise<boolean> => {
        if (!rowIndices) {
            return;
        }
        // TODO handle selection
        return selectionManager.select(
            rowIndices
                .map(index => selections.get(index))
                .filter(s => s), modifiers?.ctrlKey
        ).then((selections) => {
            if (selections.length === 0) {
                return false;
            } else {
                return true;
            }
        }); // TODO check meta for MacOS
    }, [dataView, selections]);

    const onContextMenu = React.useCallback((table: string, rowIndices: number[], modifiers: IModifiers) => {
        if (!rowIndices) {
            selectionManager.showContextMenu(null, {
                x: modifiers.clientX,
                y: modifiers.clientY
            });
            if (modifiers.event) {
                modifiers.event.preventDefault();
            }
            return true;
        }
        selectionManager.showContextMenu(
            rowIndices.map(index => selections.get(index)).filter(s => s),
            {
                x: modifiers.clientX,
                y: modifiers.clientY
            }
        );
        if (modifiers.event) {
            modifiers.event.preventDefault();
        }
        return true;
    }, [dataView, selections, selectionManager]);

    const onBackgroundContextMenu = React.useCallback((e: React.MouseEvent) => {
        onContextMenu(null, [], {
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            clientX: e.clientX,
            clientY: e.clientY,
            event: e as any
        });
    }, [onContextMenu])

    const onBackgroundClick = React.useCallback((e: React.MouseEvent) => {
        selectionManager.clear();
    }, [selectionManager])

    // TODO refactor
    const onImportTempalte = React.useCallback(async () => {
        const template = await importTempalte();
        dispatch(importTemplate(template));

        return null;
    }, [setProperty]);

    if (!dataset || !solverInitialized) {
        return (<p>Loading...</p>)
    }

    if (dataset && mode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        if (chart || !isEditor()) {
            return (
                <>
                    <Editor
                        width={viewport.width}
                        height={viewport.height}
                        chart={chart}
                        columnMappings={settings.chart.columnMappings as any}
                        dataset={dataset}
                        localizaiton={localizaiton}
                        utcTimeZone={settings.localization.utcTimeZone}
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
        }
    }

    if (unmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length > 0) {
        return (
            <>
                <FluentProvider theme={teamsLightTheme}>
                    <Mapping
                        dataset={dataset}
                        unmappedColumns={deepClone(unmappedColumns)}
                        onConfirmMapping={(mappedColumns: IColumnsMapping[]) => {
                            dispatch(setMapping(mappedColumns));
                        }}
                    />
                </FluentProvider>
            </>
        );
    }

    // TODO rework to state pattern
    if (template.default && mode === powerbi.EditMode.Default) {
        return (<>
            <div className='warning-container'>
                <div className='view-warning'>
                    <h4>Default template</h4>
                    <p>Default template without chart is loaded into the visual container</p>
                    {isEditor() ?
                        <p>Switch to editor to start creating or loading charts by using Charticulator</p> :
                        <p>Switch to editor version of the visual to start creating charts by using Charticulator</p>}
                    <p>Read more about Charticulator visual (community) in official documentation:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/')}>https://ilfat-galiev.im/docs/charticulator/</a>
                </div>
            </div>
        </>);
    }

    if (chart && !template.default && unmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length === 0) {
        return (
            <>
                {isEditor() ? (
                    <>
                        <Tooltip
                            content={{
                                className: styles.tooltipWidthClass,
                                children: (<>
                                    <p className={styles.label}>Switch the visual to view version to hide this label</p>
                                    <img className={styles.imageBorder} src={switchVisual}></img>
                                </>),
                            }}
                            relationship="label"
                        >
                            <Label>Editor preview:</Label>
                        </Tooltip>
                    </>
                ) : null}
                <div onContextMenu={onBackgroundContextMenu} onClick={onBackgroundClick}>
                    <ChartViewer
                        width={viewport.width}
                        height={viewport.height}
                        chart={chart}
                        defaultAttributes={{}}
                        dataset={dataset}
                        onSelect={onSelect}
                        onContextMenu={onContextMenu}
                        localization={localizaiton}
                        utcTimeZone={settings.localization.utcTimeZone}
                    />
                </div>
            </>
        );
    }

    if (view === powerbi.ViewMode.View && isEditor()) {
        return (<>
            <div className='warning-container'>
                <div className='view-warning'>
                    <h4>This version of the visual doesn't support view mode</h4>
                    <p>Please switch the visual to view version before save the report</p>
                    <p>Read more about Charticulator visual (community) in official documentation:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/')}>https://ilfat-galiev.im/docs/charticulator/</a>
                </div>
            </div>
        </>);
    }
}
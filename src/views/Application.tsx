import React from 'react';

import powerbi from "powerbi-visuals-api";
import PrivilegeStatus = powerbi.PrivilegeStatus;
import { Editor } from './Editor';
import { Mapping, UnmappedColumnName } from './Mapping';
import { ChartViewer, IModifiers } from './ChartViewer';
import { BillionsFormat, ColorUtils, defaultDigitsGroup, setTimeZone, uuid } from './../../charticulator/src/container';
import { initialize } from "./../../charticulator/src/core/index";
import charticulatorConfig from "./../../config.json";

import {
    setFormatOptions,
} from "charticulator/src/core/index";

import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setSolverInitialized, setMapping, IColumnsMapping, importTemplate, setProperty, setTemplate, setExportStatus } from '../redux/slices/visualSlice';
import { deepClone, isEditor } from '../utils/main';
import { importTemplateFromFile } from '../utils/importTemplate';
import { FluentProvider, Label, Tooltip, makeStyles, shorthands, teamsLightTheme } from "@fluentui/react-components";

import switchVisual from "./../../assets/label_tip.png"
import { tooltipsTablename } from '../utils/dataParser';
import { LocalizationConfig } from './../../charticulator/src/container/container';
import { copyToClipboard } from 'charticulator/src/app/utils';

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

// eslint-disable-next-line max-lines-per-function
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

    const editorInstanceID = React.useMemo(() => uuid(), []);

    const previewLabel = React.useRef<HTMLLabelElement>();

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
            host.downloadService.exportStatus().then((ex: PrivilegeStatus) => {
                dispatch(setExportStatus(ex));
            });

            await initialize({
                ...charticulatorConfig as any,
                localization: localizaiton
            });
            setFormatOptions({
                currency: [localizaiton?.currency, ""],
                grouping: defaultDigitsGroup,
                decimal: localizaiton?.decimalDelimiter,
                thousands:
                    localizaiton?.thousandsDelimiter,
            });
            setTimeZone(settings.localization.utcTimeZone);

            if (settings.colors.updateColors) {
                ColorUtils.setDefaultColorPaletteGenerator(key => ColorUtils.colorFromHTMLColor(host.colorPalette.getColor(key).value));
                ColorUtils.setDefaultColorGeneratorResetFunction(() => host.colorPalette.reset());
            }
            else {
                ColorUtils.setDefaultColorPaletteGenerator(null);
                ColorUtils.setDefaultColorGeneratorResetFunction(null);
            }

            if (dataView) {
                host.eventService.renderingFinished({});
            }
            dispatch(setSolverInitialized());
        })();
        return () => {
            host.colorPalette.reset();
        }
    }, [setSolverInitialized, setFormatOptions, initialize, host]);

    React.useEffect(() => {
        if (viewport.height < 200 || viewport.width < 200) {
            if (previewLabel.current) {
                previewLabel.current.style.display = "none";
            }

        } else {
            setTimeout(() => {
                if (previewLabel.current) {
                    previewLabel.current.style.display = "none";
                }
            }, 30000);
        }
    }, [previewLabel.current]);

    // conver data from Power BI to internal structure
    // const storedMappedColumns = (settings?.chart && JSON.parse(settings.chart.columnMappings)) ?? [];
    const localizaiton: LocalizationConfig = React.useMemo(() => ({
        currency: settings?.localization.currency,
        decimalDelimiter: settings?.localization.decimalDelimiter,
        thousandsDelimiter: settings?.localization.thousandsDelimiter,
        billionsFormat: settings.localization.billionsFormat as BillionsFormat
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
    }, [dataset, selections, selectionManager]);

    // eslint-disable-next-line
    const onMouseEnter = React.useCallback((_table: string, rowIndices?: number[], modifiers?: IModifiers) => {
        host.tooltipService.hide({
            immediately: true,
            isTouchEvent: false
        });
        if (!rowIndices) {
            return;
        }
        
        const identities = rowIndices
            .map(index => selections.get(index))
            .filter(s => s)

        const tooltipsTable = dataset.tables.find(t => t.name === tooltipsTablename);

        if (!tooltipsTable) {
            return;
        }

        const dataRows = rowIndices
            .map(index => tooltipsTable.rows[index])
            .filter(s => s)

        const dataItems = dataRows.flatMap(row => {
            return tooltipsTable.columns.map(column => {
                return {
                    displayName: column.displayName,
                    value : `${row[column.displayName]}`
                }
            })
        })

        host.tooltipService.show({
            coordinates: [modifiers.clientX, modifiers.clientY],
            dataItems,
            identities,
            isTouchEvent: false
        })
    }, [dataset]);

    // eslint-disable-next-line
    const onMouseLeave = React.useCallback((_table: string, _rowIndices: number[], _modifiers?: IModifiers) => {
        host.tooltipService.hide({
            immediately: true,
            isTouchEvent: false
        });
    }, [dataset]);

    const onRender = React.useCallback(() => {
        setTimeout(() => {
            host.colorPalette.reset();
        }, 1000)
    }, [host]);

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

    // eslint-disable-next-line
    const onBackgroundClick = React.useCallback((_e: React.MouseEvent) => {
        selectionManager.clear();
    }, [selectionManager])

    // TODO refactor
    const onImportTemplate = async () => {
        const template = await importTemplateFromFile();
        dispatch(importTemplate(template));

        return template;
    };

    if (!dataset || !solverInitialized) {
        return (<p>Loading...</p>)
    }

    if (dataset && mode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({ immediately: true, isTouchEvent: false });
        if (chart || !isEditor()) {
            return (
                <>
                    <Editor
                        instanceID={editorInstanceID}
                        setTemplate={(template) => {
                            if (typeof template === 'string') {
                                dispatch(setTemplate(template));
                            }
                            if (typeof template === 'object') {
                                dispatch(setTemplate(JSON.stringify(template)));
                            }
                        }}
                        setProperty={(property) => {dispatch(setProperty(property))}}
                        settings={settings}
                        template={template}
                        dataset={dataset}
                        columnMappings={settings.chart.columnMappings as any}
                        localization={localizaiton}
                        utcTimeZone={settings.localization.utcTimeZone}
                        onClose={() => {

                        }}
                        onExport={async (name, content, clipboard, filetype = "json") => {
                            if (clipboard) {
                                try {
                                    const clipboardPermissions = await navigator.permissions.query({ name: 'clipboard-write' as any });
                                    if (clipboardPermissions.state === 'granted') {
                                        window.focus();
                                        await navigator.clipboard.writeText(content);
                                    } else {
                                        copyToClipboard(content);
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                            } else {
                                if (filetype != "json") {
                                    filetype = "txt";
                                }
                                await host.downloadService.exportVisualsContent(content, `${name}.${filetype}`, filetype, 'template');
                            }
                        }}
                        onWebAccessStatus={async () => {
                            const access = await host.webAccessService.webAccessStatus('https://ilfat-galiev.im/');
                            return access == powerbi.PrivilegeStatus.Allowed;
                        }}
                        onImport={onImportTemplate}
                        onSupportDev={onUrl('https://github.com/sponsors/zBritva')}
                        onContactUsLink={onUrl('https://github.com/zBritva/charticulator-visual-community/discussions')}
                        onGalleryClick={onUrl('https://ilfat-galiev.im/docs/category/gallery')}
                        onGettingStartedClick={onUrl('https://ilfat-galiev.im/docs/category/charticulator')}
                        onHomeClick={onUrl('https://ilfat-galiev.im/')}
                        onIssuesClick={onUrl('https://github.com/zbritva/charticulator/issues/new')}
                        onAboutClick={onUrl('https://ilfat-galiev.im/pages/about')}
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

    if (template.default && mode === powerbi.EditMode.Default && !(settings.view.hideDefaultTemplateMessage)) {
        return (<>
            <div className='warning-container'>
                <div className='view-warning'>
                    <h4>Default template</h4>
                    <div className='content'>
                        <p>Default template without chart is loaded into the visual container</p>
                        {isEditor() ?
                            <p>Switch to editor to start creating or loading charts by using Charticulator</p> :
                            <p>Switch to editor version of the visual to start creating charts by using Charticulator</p>}
                    </div>
                    <a className='intro' onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/intro/')}>Read more about Charticulator visual (community) in official documentation</a>
                    <a className='changelog' onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/changelog/')}>Visual changelog</a>
                </div>
            </div>
        </>);
    }

    if (chart && !template.default && unmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length === 0) {
        return (
            <>
                {isEditor() && !settings.editor.hideLabel ? (
                    <>
                        <Tooltip
                            content={{
                                className: styles.tooltipWidthClass,
                                children: (<>
                                    <p className={styles.label}>Switch the visual to view version to hide this label</p>
                                    <img className={styles.imageBorder} src={switchVisual}></img>
                                    <p className={styles.label}>or disable the label in visual settings</p>
                                </>),
                            }}
                            relationship="label"
                        >
                            <Label ref={previewLabel} className='preview-label'>Editor preview:</Label>
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
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onRender={onRender}
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
                    <a onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/intro/')}>https://ilfat-galiev.im/docs/charticulator/intro/</a>
                </div>
            </div>
        </>);
    }
}

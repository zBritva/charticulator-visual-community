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
import { ChartTemplate } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
import { copyToClipboard } from 'charticulator/src/app/utils';
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

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

    const createChartFromTemplate = React.useCallback(() => {
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
    }, [template]);

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
                    chart={createChartFromTemplate()}
                    columnMappings={settings.chart.columnMappings as any}
                    dataset={dataset}
                    onSave={onSave}
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
                />
            </>
        );
    } else {

        return (
            <>
                <ChartViewer
                    width={option.viewport.width}
                    height={option.viewport.height}
                    chart={createChartFromTemplate()}
                    defaultAttributes={{}}    
                    dataset={dataset}
                    onSelect={onSelect}
                    onContextMenu={onContextMenu}
                />
            </>
        )
    }
}

export const Application = React.forwardRef(ApplicationContainer);

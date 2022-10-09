import React from 'react';

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { Editor } from './Editor';
import { ChartViewer } from './ChartViewer';
// import { Mapping } from "./Mapping"
// import { Tutorial } from "./Tutorial"
import { VisualSettings } from '../settings';
// import { checkColumns, applyMapping, updateDataValues, colorKey, defaultDompurifyConfig } from "./utils";
// import { convertPointToTooltip } from "./tooltiputils";
// import { strings } from './strings';
import { sanitize } from "dompurify";
import { convertData } from './../utils/dataParser';
import { ChartTemplate } from 'charticulator/src/container';
import { initialize } from "charticulator/src/core/index";
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
                schema: json_string
            }
        };

        host.persistProperties({
            merge: [
                instance
            ]
        });
    }, [host]);

    const onSave = React.useCallback((json_string: string) => {
        persistProperty(json_string);
    }, [persistProperty]);

    const selectionManager = React.useMemo(() => {
        return host.createSelectionManager();
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
    const dataset = React.useMemo(() => convertData(dataView), [dataView]);

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
                    onSave={(chart: any) => {
                    }}
                    onClose={() => {

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
                />
            </>
        )
    }
}

export const Application = React.forwardRef(ApplicationContainer);

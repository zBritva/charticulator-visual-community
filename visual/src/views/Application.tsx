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
// import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
export interface ApplicationProps {
    host: powerbi.extensibility.visual.IVisualHost
}

export interface ApplicationPropsRef {
    setOptions: (option: VisualUpdateOptions) => void;
}


// tslint:disable-next-line
const ApplicationContainer: React.ForwardRefRenderFunction<ApplicationPropsRef, ApplicationProps> = ({host}: ApplicationProps, ref: React.ForwardedRef<ApplicationPropsRef>) => {

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

    // conver data from Power BI to internal structure
    const settings = parseSettings(option?.dataViews[0]);
    const dataView = option?.dataViews[0];
    
    const dataset = React.useMemo(() => convertData(dataView), [dataView]);

    React.useEffect(() => {
        if (option) {
            host.eventService.renderingFinished(option);
        }
        if (settings && settings.chart.template === '{}') {
            return;
        }

    }, [settings]);

    React.useImperativeHandle(ref, () => ({
        setOptions: (option: VisualUpdateOptions) => setOptions(option)
    }));

    if (!option) {
        return (<p>Loading...</p>)
    }

    if (option && option.editMode === powerbi.EditMode.Advanced) {
        host.tooltipService.hide({immediately: true, isTouchEvent: false});
        return (
            <>
                <Editor
                    width={option.viewport.width}
                    height={option.viewport.height}
                    chart={settings.chart.template}
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
                <ChartViewer width={option.viewport.width} height={option.viewport.height} chart={{}}/>
            </>
        )
    }
}

export const Application = React.forwardRef(ApplicationContainer);

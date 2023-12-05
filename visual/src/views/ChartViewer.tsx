import { ChartContainer, Dataset, isUtcTimeZone, Specification } from "charticulator/src/container";
import { LocalizationConfig } from "charticulator/src/container/container";
import React from "react";

export interface IModifiers {
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    clientX?: number;
    clientY?: number;
}
export interface ViewerProps {
    width: number;
    height: number;
    chart: Specification.Chart;
    dataset: Dataset.Dataset;
    defaultAttributes: any;
    localization?: LocalizationConfig,
    utcTimeZone: boolean,
    onSelect?: (table: string, rowIndices: number[], modifiers?: IModifiers) => Promise<boolean>;
    onContextMenu?: (table: string, rowIndices: number[], modifiers: IModifiers) => void; 
}


export const ChartViewer: React.FC<ViewerProps> = ({
    width,
    height,
    chart,
    dataset,
    defaultAttributes,
    localization,
    utcTimeZone,
    onSelect,
    onContextMenu
}) => {
    // console.log('ChartViewer');
    debugger;

    const container = React.useMemo(() => {
        const container = new ChartContainer({ chart, defaultAttributes }, dataset, undefined, localization, utcTimeZone);

        return container;
    }, [chart, defaultAttributes, dataset, width, height]);

    React.useEffect(() => {
        container.resize(width, height);    
    }, [container, width, height]);

    container.addSelectionListener((table, rowIndexes) => {
        onSelect(table, rowIndexes).then(result => {
            if (!result) {
                container.clearSelection();
            }
        });
    });
    container.addContextMenuListener(onContextMenu);

    return container.reactMount(width, height);
}
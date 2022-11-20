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
    localizaiton?: LocalizationConfig,
    utcTimeZone: boolean,
    onSelect?: (table: string, rowIndices: number[], modifiers?: IModifiers) => void;
    onContextMenu?: (table: string, rowIndices: number[], modifiers: IModifiers) => void; 
}


export const ChartViewer: React.FC<ViewerProps> = ({
    width,
    height,
    chart,
    dataset,
    defaultAttributes,
    localizaiton,
    utcTimeZone,
    onSelect,
    onContextMenu
}) => {
    const container = React.useMemo(() => {
        const container = new ChartContainer({ chart, defaultAttributes }, dataset, undefined, localizaiton, utcTimeZone);

        return container;
    }, [chart, defaultAttributes, dataset, width, height]);

    React.useEffect(() => {
        container.resize(width, height);    
    }, [container, width, height]);

    container.addSelectionListener(onSelect);
    container.addContextMenuListener(onContextMenu);

    return container.reactMount(width, height);
}
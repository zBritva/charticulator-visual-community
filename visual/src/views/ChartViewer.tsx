import { ChartContainer, Dataset, Specification } from "charticulator/src/container";
import React from "react";

export interface ViewerProps {
    width: number;
    height: number;
    chart: Specification.Chart;
    dataset: Dataset.Dataset;
    defaultAttributes: any
}


export const ChartViewer: React.FC<ViewerProps> = ({
    width,
    height,
    chart,
    dataset,
    defaultAttributes,
}) => {
    const container = React.useMemo(() => {
        const container = new ChartContainer({ chart, defaultAttributes }, dataset);

        return container;
    }, [chart, defaultAttributes, dataset, width, height]);

    React.useEffect(() => {
        container.resize(width, height);    
    }, [container, width, height]);

    return container.reactMount(width, height);
}
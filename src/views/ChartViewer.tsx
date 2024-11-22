import { ChartContainer, Dataset, Specification } from "charticulator/src/container";
import { LocalizationConfig } from "charticulator/src/container/container";
import React from "react";

export interface IModifiers {
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    clientX?: number;
    clientY?: number;
    event?: PointerEvent;
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
    onContextMenu?: (table: string, rowIndices: number[], modifiers?: IModifiers) => void;
    onMouseEnter?: (table: string, rowIndices: number[], modifiers?: IModifiers) => void;
    onMouseLeave?: (table: string, rowIndices: number[], modifiers?: IModifiers) => void;
    onRender?: () => void;
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
    onContextMenu,
    onMouseEnter,
    onMouseLeave,
    onRender
}) => {
    // console.log('ChartViewer');

    const container = React.useMemo(() => {
        const container = new ChartContainer({ chart, defaultAttributes }, dataset, undefined, localization, utcTimeZone);

        return container;
    }, [chart, defaultAttributes, dataset, width, height]);

    React.useEffect(() => {
        container.resize(width, height);
    }, [container, width, height]);

    React.useEffect(() => {
        onRender();
    }, [onRender]);

    container.addSelectionListener((table, rowIndexes) => {
        onSelect(table, rowIndexes).then(result => {
            if (!result) {
                container.clearSelection();
            }
        });
    });
    container.addContextMenuListener(onContextMenu);
    container.addMouseEnterListener(onMouseEnter);
    container.addMouseLeaveListener(onMouseLeave);

    return container.reactMount(width, height);
}
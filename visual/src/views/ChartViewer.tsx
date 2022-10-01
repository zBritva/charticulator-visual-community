import React from "react";

export interface ViewerProps {
    width: number;
    height: number;
    chart: any;
}


export const ChartViewer: React.FC<ViewerProps> = ({
    width,
    chart,
    height,
}) => {

    return (
        <p>
            Viewer
        </p>
    )
}
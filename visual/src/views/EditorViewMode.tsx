import React from "react";

import { LocalizationConfig } from "charticulator/src/container/container";

import {
    Specification,
} from "charticulator/src/core/index";

import { Dataset } from "charticulator/src/core";

import { MainViewConfig } from "./IEditor";

export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    onSave: (chart: {
        chart: Specification.Chart,
        template: Specification.Template.ChartTemplate
    }) => void;
    localizaiton?: LocalizationConfig,
    utcTimeZone: boolean,
    onClose: () => void;
    onExport: (template: Specification.Template.ChartTemplate, clipboard: boolean) => void;
    onImport: () => Promise<Specification.Chart>;
}

export const Editor: React.FC<EditorProps> = () => {
    return (<>
        <div className="editor-warning">
            <h4>It's view container, to edit the chart switch to Charticulator Editor</h4>
        </div>
    </>);
};

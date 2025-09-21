/* eslint-disable powerbi-visuals/insecure-random */
/* eslint-disable max-lines-per-function */
import "./../../style/editor.less";

import {
    Specification,
} from "charticulator/src/core/index";
import { MainViewConfig } from "charticulator/src/app/config";
import { Dataset } from "charticulator/src/core";


import { LocalizationConfig } from "charticulator/src/container/container";
import { Theme } from "@fluentui/react-components";

import { NestedChartEditorOptions } from "charticulator/src/core/prototypes/controls";
import { IVisualSettings } from "../settings";


export interface EditorProps {
    instanceID: string;
    // width?: number;
    // height?: number;
    // chart?: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    // onSave: (chart: {
    //     chart: Specification.Chart,
    //     template: Specification.Template.ChartTemplate
    // }) => void;
    localization?: LocalizationConfig,
    backgroundColor?: string,
    theme?: Partial<Theme>,
    utcTimeZone: boolean,

    settings?: IVisualSettings,
    template?: Specification.Template.ChartTemplate;

    isNestedEditor?: boolean;
    nestedEditorOptions?: NestedChartEditorOptions;
    name?: string;

    onClose?: () => void;
    onExport?: (name: string, template: string, clipboard: boolean, filetype: string) => void;
    onSupportDev?: () => void;
    onImport?: () => Promise<string>;
    onUrlClick?: (url: string) => void;
    onContactUsLink?: () => void;
    onGettingStartedClick?: () => void;
    onGalleryClick?: () => void;
    onIssuesClick?: () => void;
    onHomeClick?: () => void;
    onAboutClick?: () => void;


    setTemplate?: (template: string | Specification.Template.ChartTemplate, specification: Specification.Chart) => void;
    setProperty?: (property: { objectName: string, objectProperty: string, value: any }) => void;
    onWebAccessStatus?: () => Promise<boolean>;
}
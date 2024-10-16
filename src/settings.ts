/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { DataViewObjectsParser } from "./utils/dataViewObjectsParser";

import template from "../assets/Chart.json";
import { Specification } from "charticulator/src/container";

export const defaultTemplate = template as Specification.Template.ChartTemplate;

export interface IVisualSettings {
    chart: ChartSettings
    localization: Localization
    defaults: Defaults
    panels: Panels
    colors: Colors
    highlight: Highlight
    editor: Editor;
    view: View;
}

export class VisualSettings extends DataViewObjectsParser implements IVisualSettings {
    public chart: ChartSettings = new ChartSettings();
    public localization: Localization = new Localization();
    public defaults: Defaults = new Defaults();
    public panels: Panels = new Panels();
    public colors: Colors = new Colors();
    public highlight: Highlight = new Highlight();
    public editor: Editor = new Editor();
    public view: View = new View();

    constructor() {
        super();
    }
}


export class ChartSettings {
    public template: string = JSON.stringify(defaultTemplate);
    public columnMappings: string = "[]";
}

export class Localization {
    public decimalDelimiter: string = ".";
    public thousandsDelimiter: string = ",";
    public currency: string = "$";
    public utcTimeZone: boolean = true;
    public billionsFormat: string = "giga";
}

export class Defaults {
    public left: number = 20;
    public right: number = 20;
    public top: number = 20;
    public bottom: number = 20;
    public width: number = 600;
    public height: number = 400;
}

export class Panels {
    public defaultPanelsPosition: string = "right";
    public defaultDatasetPanelPosition: string = "right";
}

export class Colors {
    public updateColors: boolean = true;
}

export class Highlight {
    public addHighlightColumns: boolean = false;
}

export class Editor {
    public hideLabel: boolean = false;
}

export class View {
    public hideDefaultTemplateMessage: boolean = false;
}
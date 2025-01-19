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

    public static Equal(_this, other: VisualSettings) {
        return _this.chart.Equal(other.chart) &&
            _this.localization.Equal(other.localization) &&
            _this.defaults.Equal(other.defaults) &&
            _this.panels.Equal(other.panels) &&
            _this.colors.Equal(other.colors) &&
            _this.highlight.Equal(other.highlight) &&
            _this.editor.Equal(other.editor) &&
            _this.view.Equal(other.view);
    }

    constructor() {
        super();
    }
}


export class ChartSettings {
    public template: string = JSON.stringify(defaultTemplate);
    public columnMappings: string = "[]";

    public static Equal(_this, other: ChartSettings) {
        return _this.columnMappings == other.columnMappings && _this.template == other.template
    }
}

export class Localization {
    public decimalDelimiter: string = ".";
    public thousandsDelimiter: string = ",";
    public currency: string = "$";
    public utcTimeZone: boolean = true;
    public billionsFormat: string = "giga";

    public static Equal(_this, other: Localization) {
        return _this.decimalDelimiter == other.decimalDelimiter &&
            _this.thousandsDelimiter == other.thousandsDelimiter &&
            _this.currency == other.currency &&
            _this.utcTimeZone == other.utcTimeZone &&
            _this.billionsFormat == other.billionsFormat
    }
}

export class Defaults {
    public left: number = 20;
    public right: number = 20;
    public top: number = 20;
    public bottom: number = 20;
    public width: number = 600;
    public height: number = 400;

    public static Equal(_this, other: Defaults) {
        return _this.height == other.height &&
            _this.width == other.width &&
            _this.bottom == other.bottom &&
            _this.top == other.top &&
            _this.right == other.right &&
            _this.left == other.left
    }
}

export class Panels {
    public defaultPanelsPosition: string = "right";
    public defaultDatasetPanelPosition: string = "right";

    public static Equal(_this, other: Panels) {
        return _this.defaultPanelsPosition == other.defaultPanelsPosition && _this.defaultDatasetPanelPosition == other.defaultDatasetPanelPosition
    }
}

export class Colors {
    public updateColors: boolean = true;
    public applyPowerBITheme: boolean = false;

    public static Equal(_this, other: Colors) {
        return _this.updateColors == other.updateColors && _this.applyPowerBITheme == other.applyPowerBITheme
    }
}

export class Highlight {
    public addHighlightColumns: boolean = false;

    public static Equal(_this, other: Highlight) {
        return _this.addHighlightColumns == other.addHighlightColumns
    }
}

export class Editor {
    public hideLabel: boolean = false;
    public applyDataUpdates: boolean = false;

    public static Equal(_this, other: Editor) {
        return _this.applyDataUpdates == other.applyDataUpdates && _this.hideLabel == other.hideLabel
    }
}

export class View {
    public hideDefaultTemplateMessage: boolean = false;

    public static Equal(_this: View, other: View) {
        return _this.hideDefaultTemplateMessage == other.hideDefaultTemplateMessage
    }
}
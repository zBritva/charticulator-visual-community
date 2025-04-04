/*
*  Power BI Visual CLI
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

import React from 'react';
import reactDom from 'react-dom/client';
import { Application } from './views/Application';

import { store } from './redux/store'
import { Provider } from 'react-redux'

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import VisualUpdateType = powerbi.VisualUpdateType;

import { VisualSettings } from "./settings";
import { deepClone } from "./utils/main";
import { checkSupportsHighlight, setDataView, setHost, setMode, setSettings, setViewMode, setViewport, updateScales } from './redux/slices/visualSlice';

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;

    constructor(options?: VisualConstructorOptions) {
        // console.log('Visual constructor', options);
        if (!options) {
            return;
        }
        this.target = options.element;
        if (document) {
            store.dispatch(setHost(options.host));

            const application = React.createElement(Application, {
                key: "application"
            });

            const provider = React.createElement(Provider, {
                key: "store_provider",
                store,
                children: [application]
            });

            const root = reactDom.createRoot(this.target);
            root.render(provider);
        }
    }

    public update(options: VisualUpdateOptions) {
        const dispatch = store.dispatch;
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        dispatch(checkSupportsHighlight(this.settings.chart.template));
        dispatch(setViewport(deepClone(options.viewport)));
        dispatch(setDataView(deepClone(options.dataViews[0])));
        dispatch(setMode(options.editMode));
        dispatch(setViewMode(options.viewMode));
        dispatch(setSettings(deepClone(this.settings)));
        if (options.type & VisualUpdateType.Data) {
            dispatch(updateScales());
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        const settings = VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options) as VisualObjectInstanceEnumerationObject;
        if (options.objectName === 'localization') {
            
            // hide for beta
            delete settings.instances[0].properties['utcTimeZone'];

            return settings;
        }

        // if (options.objectName === 'highlight') {
        //     settings.instances.pop();
        //     return settings;
        // }

        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}
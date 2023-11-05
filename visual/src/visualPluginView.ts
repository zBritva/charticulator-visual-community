import { Visual } from "../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var charticulatorVisualCommunity487D3ADCA7E14F729E78065092536DBD_VIEW: IVisualPlugin = {
    name: 'charticulatorVisualCommunity487D3ADCA7E14F729E78065092536DBD_VIEW',
    displayName: 'CharticulatorCommunityVersionView',
    class: 'Visual',
    apiVersion: '4.7.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["charticulatorVisualCommunity487D3ADCA7E14F729E78065092536DBD_VIEW"] = charticulatorVisualCommunity487D3ADCA7E14F729E78065092536DBD_VIEW;
}
export default charticulatorVisualCommunity487D3ADCA7E14F729E78065092536DBD_VIEW;
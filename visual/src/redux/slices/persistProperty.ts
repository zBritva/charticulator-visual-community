

import powerbi from "powerbi-visuals-api"
import IVisualHost = powerbi.extensibility.visual.IVisualHost

export function persistProperty (host: IVisualHost, object: string, property: string, value: string) {
    const instance: powerbi.VisualObjectInstance = {
        objectName: object,
        selector: null,
        properties: {
            [property]: value
        }
    };

    host.persistProperties({
        merge: [
            instance
        ]
    });
}
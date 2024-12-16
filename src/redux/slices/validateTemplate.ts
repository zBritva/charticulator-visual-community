export function validateTemplate(template: any) : {
    valid: boolean,
    error?: string
}
{
    let valid = true;
    let error = null;
    if (template.specification == undefined) {
        valid = false;
        error = "specification not found";
    }
    if (template.specification.properties == undefined) {
        valid = false;
        error = "properties not found";
    }
    if (template.specification.mappings == undefined) {
        valid = false;
        error = "mappings not found";
    }
    if (template.specification.glyphs == undefined) {
        valid = false;
        error = "glyphs not found";
    }
    if (template.specification.elements == undefined) {
        valid = false;
        error = "elements not found";
    }
    if (template.specification.scales == undefined) {
        valid = false;
        error = "scales not found";
    }
    if (template.specification.scaleMappings == undefined) {
        valid = false;
        error = "scaleMappings not found";
    }
    if (template.defaultAttributes == undefined) {
        valid = false;
        error = "defaultAttributes not found";
    }
    if (template.tables == undefined) {
        valid = false;
        error = "tables not found";
    }
    if (template.inference == undefined) {
        valid = false;
        error = "inferences not found";
    }
    if (template.properties == undefined) {
        valid = false;
        error = "properties not found";
    }
    if (template.version == undefined) {
        valid = false;
        error = "version is not set";
    }
    if (template.default) {
        valid = false;
        error = "Default template can't be imported";
    }

    return {
        valid,
        error
    };
}

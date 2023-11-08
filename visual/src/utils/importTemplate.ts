import { readFileAsString } from "charticulator/src/app/utils";

export function importTempalte() {
    return new Promise<any>((resolve, reject) => {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        let file: File = null;
        inputElement.accept = ["tmplt", "json"]
            .map((x) => "." + x)
            .join(",");
        // eslint-disable-next-line
        inputElement.onchange = async () => {
            if (inputElement.files.length == 1) {
                file = inputElement.files[0];
                if (file) {
                    try {
                        const template = await readFileAsString(file);
                        JSON.parse(template); // parse ensure that string is JSON
                        resolve(template);
                    } catch (e) {
                        console.error(e);
                        reject();
                    }
                }
            } else {
                reject();
            }
        }
        inputElement.click();
    });
}
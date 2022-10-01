import React from "react";

import { MainView  } from "charticulator/src/app/main_view";
import { AppStore, Migrator } from "charticulator/src/app/stores";
import { makeDefaultDataset } from "charticulator/src/app/default_dataset";
import { CharticulatorWorker, CharticulatorWorkerInterface } from "charticulator/src/worker";
import { initialize } from "charticulator/src/core/index";
import { CharticulatorAppConfig } from "charticulator/src/app/config";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

console.log('script', script.default);
initialize(charticulatorConfig);


export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    onSave: (chart: any) => void;
}


export const Editor: React.FC<EditorProps> = ({
    width,
    chart,
    height,
    onSave
}) => {

    let mainView: MainView = null;
    
    const config: CharticulatorAppConfig = React.useMemo(() => charticulatorConfig, [charticulatorConfig]);
    const workerScript = React.useMemo(() => {
        const blob = new Blob([script.default], { type: "application/javascript" });

        const workerScript = URL.createObjectURL(blob);

        return workerScript;
    }, [script]);

    const worker: CharticulatorWorkerInterface =  new CharticulatorWorker(workerScript);
    const appStore = new AppStore(worker, makeDefaultDataset());

    React.useEffect(() => {
        (async () => {
            await worker.initialize(config);
        })();
    }, [worker, config]);

    return (
        <>
            <p>
                Editor
            </p>
            <MainView
                store={appStore}
                ref={(e) => (mainView = e)}
                viewConfiguration={config.MainView}
                menuBarHandlers={{
                    onContactUsLink: () => {},
                    onCopyToClipboardClick: () => {},
                    onExportTemplateClick: () => {},
                    onImportTemplateClick: () => {},
                }}
                tabButtons={null}
                telemetry={{
                    record: () => {}
                }}
            />
        </>
        
    )
}
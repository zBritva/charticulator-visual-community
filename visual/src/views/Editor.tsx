import React from "react";

import { MainView  } from "charticulator/src/app/main_view";
import { AppStore, Migrator } from "charticulator/src/app/stores";
import { makeDefaultDataset } from "charticulator/src/app/default_dataset";
import { CharticulatorWorker, CharticulatorWorkerInterface } from "charticulator/src/worker";
import { deepClone, initialize, Prototypes, Specification } from "charticulator/src/core/index";
import { CharticulatorAppConfig } from "charticulator/src/app/config";
import { Actions, NestedEditorData } from "charticulator/src/app";
import { MappingType } from "charticulator/src/core/specification";
import { Dataset } from "charticulator/src/core";
import { defaultVersionOfTemplate } from "charticulator/src/app/stores/defaults";
import { EditorType } from "charticulator/src/app/stores/app_store";
import { NestedEditorMessage, NestedEditorMessageType } from "charticulator/src/app/application";

const script = require("raw-loader!charticulator/dist/scripts/worker.bundle.js");
const charticulatorConfig = require("json-loader!./../../charticulator/dist/scripts/config.json");

console.log('script', script.default);
initialize(charticulatorConfig);


export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset,
    columnMappings: {[key: string]: string}
    onSave: (chart: any) => void;
    onClose: () => void;
}


export const Editor: React.FC<EditorProps> = ({
    width,
    chart,
    height,
    dataset,
    onSave,
    onClose
}) => {
    // let mainView: MainView = null;
    
    const config: CharticulatorAppConfig = React.useMemo(() => charticulatorConfig, [charticulatorConfig]);
    const workerScript = React.useMemo(() => {
        const blob = new Blob([script.default], { type: "application/javascript" });

        const workerScript = URL.createObjectURL(blob);

        return workerScript;
    }, [script]);

    const worker: CharticulatorWorkerInterface =  React.useMemo(() => new CharticulatorWorker(workerScript), []);
    const appStore = new AppStore(worker, dataset || makeDefaultDataset());

    const setupCallback = React.useCallback(
        (data: NestedEditorData) => {
        const info: NestedEditorData = data;
        if (info.specification && info.specification.mappings) {
            info.specification.mappings.width = {
              type: MappingType.value,
              value: info.width,
            } as Specification.ValueMapping;
            info.specification.mappings.height = {
              type: MappingType.value,
              value: info.height,
            } as Specification.ValueMapping;
        }
  
        const chartManager = new Prototypes.ChartStateManager(
          info.specification,
          info.dataset,
          null,
          {},
          {},
          deepClone(info.specification)
        );
  
        // if version wasn't saved in tempalte we asume it is 2.0.3
        if (info.template && info.template.version == undefined) {
          info.template.version = defaultVersionOfTemplate;
        }
        const newState = new Migrator().migrate(
          {
            chart: chartManager.chart,
            chartState: chartManager.chartState,
            dataset: chartManager.dataset,
            version: info.template?.version || defaultVersionOfTemplate,
            originDataset: appStore.originDataset,
          },
          CHARTICULATOR_PACKAGE.version
        );
        appStore.dispatcher.dispatch(
          new Actions.ImportChartAndDataset(
            info.specification,
            info.dataset,
            {
              filterCondition: info.filterCondition,
            },
            info.originSpecification
          )
        );
  
        if (info.template) {
          info.template.version = newState.version;
        }
        if (onClose) {
          appStore.addListener(AppStore.EVENT_NESTED_EDITOR_CLOSE, () => {
            onClose();
          });
        }
  
        let type = EditorType.Embedded;
        //   this.config.CorsPolicy && this.config.CorsPolicy.Embedded
        //     ? EditorType.Embedded
        //     : EditorType.Nested;
  
        // // settings from outside overrides the configuration
        // if (editorMode) {
        //   type = editorMode;
        // }
  
        appStore.setupNestedEditor((newSpecification) => {
          const template = deepClone(appStore.buildChartTemplate());
          onSave({
            specification: newSpecification,
            template,
          } as NestedEditorMessage);
        }, type);
      }
    , [appStore]);

    React.useEffect(() => {
        (async () => {
            await worker.initialize(config);
            setupCallback({
                template: chart,
                height,
                width, 
                type: null,
                dataset: dataset,
                id: "",
                specification: chart,
                originSpecification: chart,
                filterCondition: null
            })
        })();
    }, [worker, config]);

    return (
        <>
            <MainView
                store={appStore}
                // ref={(e) => (mainView = e)}
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
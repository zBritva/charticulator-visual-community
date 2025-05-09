import React from "react";

import "./../../style/container.less";

import {
    Specification,
} from "charticulator/src/core/index";

import { useAppSelector } from '../redux/hooks'
import { Button, FluentProvider } from "@fluentui/react-components";

import { EditorProps } from "./IEditorProps";

export const Editor: React.FC<EditorProps> = ({ onImport, onExport, settings, theme }) => {

    const host = useAppSelector((store) => store.visual.host);
    const exportAllowed = useAppSelector((store) => store.visual.exportAllowed);
    const importError = useAppSelector((store) => store.visual.importResult);

    const onUrl = React.useCallback((url: string) => {
        return () => host.launchUrl(url);
    }, [host]);
    
    const template: Specification.Template.ChartTemplate = settings ? JSON.parse(settings.chart.template) : null;

    return (<>
        <FluentProvider theme={theme} style={{height: '100%'}}>
            <div className='warning-container'>
                <div className="editor-warning">
                    <h4>This version of the visual doesn't support editing chart.</h4>
                    <p>To edit the chart switch visual to editor version</p>
                    <p>Read more about Charticulator visual (community) in documentation:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/intro/')}>https://ilfat-galiev.im/docs/charticulator/</a>
                    <p>Or import template created on:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/charticulator')}>https://ilfat-galiev.im/charticulator</a>
                    <div className="upload">
                        <Button
                            appearance="primary"
                            onClick={onImport}
                        >
                            Import template
                        </Button>
                        {
                            importError ? 
                            <pre>{importError}</pre>:
                            null
                        }
                    </div>
                    <div className="download">
                        {!exportAllowed ? (
                            <p>Exporting visual content is not allowed.<br/>The chart content will copied to clipboard</p>
                        ): null}
                        <Button
                            disabled={!settings || template.default}
                            appearance="secondary"
                            onClick={() => {
                                if (!settings) {
                                    return;
                                }
                                
                                onExport("chart", settings.chart.template, !exportAllowed, ".json");
                            }}
                        >
                            Download current template
                        </Button>
                    </div>
                </div>
            </div>
        </FluentProvider>
    </>);
};


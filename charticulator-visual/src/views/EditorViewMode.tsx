import React from "react";

import { LocalizationConfig } from "charticulator/src/container/container";

import {
    Specification,
} from "charticulator/src/core/index";

import { Dataset } from "charticulator/src/core";

import { MainViewConfig } from "./IEditor"
import { useAppSelector } from '../redux/hooks'
import { Button, FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { string } from "charticulator/src/core/expression";

export interface EditorProps {
    width: number;
    height: number;
    chart: any;
    dataset: Dataset.Dataset;
    columnMappings: { [key: string]: string };
    mainView?: MainViewConfig,
    onSave: (chart: {
        chart: Specification.Chart,
        template: Specification.Template.ChartTemplate
    }) => void;
    localizaiton?: LocalizationConfig,
    utcTimeZone: boolean,
    onClose: () => void;
    onExport: (template: Specification.Template.ChartTemplate, clipboard: boolean) => void;
    onImport: () => Promise<Specification.Chart>;
}

export const Editor: React.FC<EditorProps> = ({ onImport }) => {

    const host = useAppSelector((store) => store.visual.host);

    const onUrl = React.useCallback((url: string) => {
        return () => host.launchUrl(url);
    }, [host]);

    return (<>
        <FluentProvider theme={teamsLightTheme} style={{height: '100%'}}>
            <div className='warning-container'>
                <div className="editor-warning">
                    <h4>This version of the visual doesn't support editing chart.</h4>
                    <p>To edit the chart switch visual to editor version</p>
                    <p>Read more about Charticulator visual (community) in documentation:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/docs/charticulator/')}>https://ilfat-galiev.im/docs/charticulator/</a>
                    <p>Or import template created on:</p>
                    <a onClick={onUrl('https://ilfat-galiev.im/charticulator')}>https://ilfat-galiev.im/charticulator</a>
                    <Button
                        appearance="primary"
                        onClick={onImport}
                    >
                        Import template
                    </Button>
                </div>
            </div>
        </FluentProvider>
    </>);
};


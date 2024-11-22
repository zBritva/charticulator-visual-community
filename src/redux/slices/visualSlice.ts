import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Editor, IVisualSettings, View, VisualSettings, defaultTemplate, Colors, ChartSettings, Defaults, Highlight, Localization, Panels } from '../../settings'

import powerbi from "powerbi-visuals-api"
import IViewport = powerbi.IViewport
import DataView = powerbi.DataView
import EditMode = powerbi.EditMode
import ViewMode = powerbi.ViewMode
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import PrivilegeStatus = powerbi.PrivilegeStatus;

import { ColorUtils, Dataset, Prototypes, Specification } from './../../../charticulator/src/core';

import { persistProperty } from './persistProperty'
import { createChartFromTemplate } from '../../utils/template'
import { convertData, highlightsColumnSuffix } from '../../utils/dataParser'
import { deepClone } from '../../utils/main'
import { ChartTemplateBuilder } from './../../../charticulator/src/app/template'
import { defaultVersionOfTemplate } from './../../../charticulator/src/app/stores/defaults'
import { TableType } from 'charticulator/src/core/dataset'
import { AppStore } from 'charticulator/src/app/stores'
import { Actions } from 'charticulator/src/app'

export interface IColumnsMapping {
    table: string,
    tableType: Dataset.TableType,
    column: string,
    columnType: Dataset.DataType,
    powerbiColumn: string
}

export interface VisualState {
    settings: IVisualSettings
    template: Specification.Template.ChartTemplate
    chart: Specification.Chart
    supportsHighlight?: boolean
    dataset: Dataset.Dataset
    selections: Map<number, powerbi.extensibility.ISelectionId>
    viewport: IViewport
    dataview: DataView
    mode: EditMode
    view: ViewMode
    solverInitialized: boolean
    exportAllowed: boolean
    host: IVisualHost
    unmappedColumns: IColumnsMapping[]
    mapping: IColumnsMapping[]
    appStore: AppStore
}

export interface Property {
    objectName: string
    objectProperty: string
    value: string
}

const initialState: VisualState = {
    viewport: {
        height: 0,
        width: 0
    },
    dataview: null,
    mode: EditMode.Default,
    settings: VisualSettings.getDefault() as VisualSettings,
    chart: null,
    supportsHighlight: undefined,
    dataset: {
        name: "main",
        tables: []
    },
    selections: new Map(),
    template: defaultTemplate,
    solverInitialized: false,
    host: null,
    unmappedColumns: [],
    view: ViewMode.View,
    appStore: null,
    mapping: [],
    exportAllowed: false
}

function rebuildTemplate(templateString: string, dataset: Dataset.Dataset, mapping: IColumnsMapping[]) {
    const { chart, unmappedColumns } = createChartFromTemplate(templateString, dataset, mapping)
    
    if (!chart) {
        return { template: null, unmappedColumns, chart: null }
    }

    const chartManager = new Prototypes.ChartStateManager(
        chart,
        dataset,
        null,
        {},
        {}
    )

    const builder = new ChartTemplateBuilder(
        chart,
        dataset,
        chartManager,
        CHARTICULATOR_PACKAGE.version
    );

    return { template: builder.build(), unmappedColumns, chart }
}

function loadTemplateToState(templateString: string, state) {
    const dataset = state.dataset
    const mapping = state.mapping

    const { template, unmappedColumns, chart } = rebuildTemplate(templateString, dataset, mapping)

    state.template = template
    state.unmappedColumns = unmappedColumns
    state.chart = chart
}

function writeObject(host: IVisualHost, name: string, object: any)
{
    const properties = Object.keys(object);

    properties.forEach(property => {
        persistProperty(host, name, property, object[property]);
    })
}

export const visualSlice = createSlice({
    name: 'visual',
    initialState,
    reducers: {
        setHost: (state, action: PayloadAction<IVisualHost>) => {
            state.host = action.payload
        },
        setSettings: (state, action: PayloadAction<IVisualSettings>) => {
            const settings: IVisualSettings = action.payload;

            if (!Editor.Equal(settings.editor, state.settings.editor)) {
                writeObject(state.host, "editor", settings.editor);
            }
            if (!View.Equal(settings.view, state.settings.view)) {
                writeObject(state.host, "view", settings.view);
            }
            if (!Colors.Equal(settings.colors, state.settings.colors)) {
                writeObject(state.host, "colors", settings.colors);
            }
            if (!Defaults.Equal(settings.defaults, state.settings.defaults)) {
                writeObject(state.host, "defaults", settings.defaults);
            }
            if (!Highlight.Equal(settings.highlight, state.settings.highlight)) {
                writeObject(state.host, "highlight", settings.highlight);
            }
            if (!Localization.Equal(settings.localization, state.settings.localization)) {
                writeObject(state.host, "localization", settings.localization);
            }
            if (!Panels.Equal(settings.panels, state.settings.panels)) {
                writeObject(state.host, "panels", settings.panels);
            }

            state.settings = settings
            if (state.settings.chart.columnMappings == '{}') {
                state.mapping = []
            } else {
                const mapping = JSON.parse(state.settings.chart.columnMappings)
                if (mapping instanceof Array) {
                    state.mapping = mapping
                } else {
                    //convert old Charticulator mapping to new
                }
            }
            loadTemplateToState(action.payload.chart.template, state)
            if (settings.colors.updateColors) {
                applyColors(state);
            }
            const templateJSON: Specification.Template.ChartTemplate = JSON.parse(action.payload.chart.template);
            if (templateJSON.default) {
                state.template.default = true;
            }
        },
        updateScales: (state) => {
            applyColors(state)
        },
        setTemplate: (state, action: PayloadAction<string>) => {
            loadTemplateToState(action.payload, state)
        },
        setViewport: (state, action: PayloadAction<IViewport>) => {
            state.viewport = action.payload
        },
        checkSupportsHighlight: (state, action: PayloadAction<string>) => {
            const template = action.payload;
            const parsedTemplate = JSON.parse(template)
            const mainTable = parsedTemplate.tables.find(table => table.type == TableType.Main);

            if (mainTable) {
                const hasHighlightsColumn = mainTable.columns.find(column => column.name.endsWith(highlightsColumnSuffix)) != undefined
                state.supportsHighlight = hasHighlightsColumn ? true : undefined;
            }
        },
        setDataView: (state, action: PayloadAction<DataView>) => {
            state.dataview = action.payload

            // TODO reset chart on template reset
            const template = state.settings.chart.template
            const mapping = state.mapping

            // TODO add template migration
            state.template = JSON.parse(template)
            if (state.template && state.template.version == undefined) {
                state.template.version = defaultVersionOfTemplate
            }

            const [dataset, selections] = convertData(state.dataview, state.host.createSelectionIdBuilder, (state.supportsHighlight ?? false) || state.settings.highlight.addHighlightColumns);
            state.dataset = dataset
            state.selections = selections
            if (state.appStore && state.settings.editor.applyDataUpdates) {
                state.appStore.dispatcher.dispatch(new Actions.ImportChartAndDataset(state.appStore.chartManager.chart ,state.dataset, {}))
                state.appStore.dispatcher.dispatch(new Actions.UpdatePlotSegments())
                state.appStore.updatePlotSegments();
                // state.appStore.updateNestedCharts();
                // state.appStore.updateScales();
            }

            const { chart, unmappedColumns } = createChartFromTemplate(state.settings.chart.template, dataset, mapping)

            state.unmappedColumns = unmappedColumns;

            state.chart = chart
        },
        setMode: (state, action: PayloadAction<EditMode>) => {
            state.mode = action.payload
        },
        setViewMode: (state, action: PayloadAction<ViewMode>) => {
            state.view = action.payload
        },
        setSolverInitialized: (state) => {
            state.solverInitialized = true;
        },
        setExportStatus: (state, exp: PayloadAction<PrivilegeStatus>) => {
            state.exportAllowed = exp.payload === PrivilegeStatus.Allowed;
        },
        setProperty: (state, action: PayloadAction<Property>) => {
            const property = action.payload
            persistProperty(state.host, property.objectName, property.objectProperty, property.value)
        },
        setEditorStore: (state, action: PayloadAction<AppStore>) => {
            state.appStore = action.payload;
        },
        setMapping: (state, action: PayloadAction<IColumnsMapping[]>) => {
            state.mapping = action.payload

            const templateString = JSON.stringify(state.template || JSON.parse(state.settings.chart.template))
            // TODO remove deep clone
            const { template, unmappedColumns, chart } = rebuildTemplate(templateString, deepClone(state.dataset), state.mapping)

            state.chart = chart
            state.template = template
            state.unmappedColumns = unmappedColumns

            // save the chart with new mapping;
            persistProperty(state.host, 'chart', 'template', JSON.stringify(template));
            persistProperty(state.host, 'chart', 'columnMappings', JSON.stringify(state.mapping))
        },
        importTemplate: (state, action: PayloadAction<string>) => {
            const template = action.payload
            const parsed = JSON.parse(template)
            const { chart, unmappedColumns } = createChartFromTemplate(template, state.dataset, state.mapping)

            persistProperty(state.host, 'chart', 'template', JSON.stringify(parsed))
            if (chart && unmappedColumns.length === 0) {
                state.chart = chart
                state.template = parsed
                state.unmappedColumns = unmappedColumns
            } else {
                state.unmappedColumns = unmappedColumns
                state.template = parsed
                state.chart = null
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setSettings,
    updateScales,
    setViewport,
    setDataView,
    setMode,
    setViewMode,
    setSolverInitialized,
    setHost,
    setProperty,
    setEditorStore,
    setMapping,
    setTemplate,
    importTemplate,
    checkSupportsHighlight,
    setExportStatus
} = visualSlice.actions

export default visualSlice.reducer

function applyColors(state) {
    state.host.colorPalette.reset()
    const updateColors = (scale) => {
        if (scale.classID === "scale.categorical<string,color>") {
            if (scale.properties.mapping) {
                for (const key of Object.keys(scale.properties.mapping)) {
                    const color = state.host.colorPalette.getColor(key).value
                    scale.properties.mapping[key] = ColorUtils.colorFromHTMLColor(color)
                }
            }
        }

        return scale
    }

    state.chart.scales.forEach(updateColors)
    state.template.specification.scales.forEach(updateColors)
}


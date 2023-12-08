import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IVisualSettings, VisualSettings, defaultTemplate } from '../../settings'

import powerbi from "powerbi-visuals-api"
import IViewport = powerbi.IViewport
import DataView = powerbi.DataView
import EditMode = powerbi.EditMode
import ViewMode = powerbi.ViewMode
import IVisualHost = powerbi.extensibility.visual.IVisualHost

import { Dataset, Prototypes, Specification } from 'charticulator/src/core';

import { persistProperty } from './persistProperty'
import { createChartFromTemplate } from '../../utils/template'
import { convertData } from '../../utils/dataParser'
import { deepClone } from '../../utils/main'
import { ChartTemplateBuilder } from 'charticulator/src/app/template'
import { defaultVersionOfTemplate } from 'charticulator/src/app/stores/defaults'

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
    dataset: Dataset.Dataset
    selections: Map<number, powerbi.extensibility.ISelectionId>
    viewport: IViewport
    dataview: DataView
    mode: EditMode
    view: ViewMode
    solverInitialized: boolean
    host: IVisualHost
    unmappedColumns: IColumnsMapping[]
    mapping: IColumnsMapping[]
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
    mapping: []
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

export const visualSlice = createSlice({
    name: 'visual',
    initialState,
    reducers: {
        setHost: (state, action: PayloadAction<IVisualHost>) => {
            state.host = action.payload
        },
        setSettings: (state, action: PayloadAction<IVisualSettings>) => {
            state.settings = action.payload

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
            const templateJSON: Specification.Template.ChartTemplate = JSON.parse(action.payload.chart.template);
            if (templateJSON.default) {
                state.template.default = true;
            }
        },
        setTemplate: (state, action: PayloadAction<string>) => {
            loadTemplateToState(action.payload, state)
        },
        setViewport: (state, action: PayloadAction<IViewport>) => {
            state.viewport = action.payload
        },
        setDataView: (state, action: PayloadAction<DataView>) => {
            state.dataview = action.payload
            const [dataset, selections] = convertData(state.dataview, state.host.createSelectionIdBuilder, state.settings.localization.utcTimeZone);
            state.dataset = dataset
            state.selections = selections

            // TODO reset chart on template reset
            const template = state.settings.chart.template
            const mapping = state.mapping

            // TODO add template migration
            state.template = JSON.parse(template)
            if (state.template && state.template.version == undefined) {
                state.template.version = defaultVersionOfTemplate
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
        setProperty: (state, action: PayloadAction<Property>) => {
            const property = action.payload
            persistProperty(state.host, property.objectName, property.objectProperty, property.value)
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
    setViewport,
    setDataView,
    setMode,
    setViewMode,
    setSolverInitialized,
    setHost,
    setProperty,
    setMapping,
    setTemplate,
    importTemplate
} = visualSlice.actions

export default visualSlice.reducer


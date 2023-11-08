import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IVisualSettings, VisualSettings, defaultTemplate } from '../../settings'

import powerbi from "powerbi-visuals-api"
import IViewport = powerbi.IViewport
import DataView = powerbi.DataView
import EditMode = powerbi.EditMode
import ViewMode = powerbi.ViewMode
import IVisualHost = powerbi.extensibility.visual.IVisualHost

import { Dataset, Specification } from 'charticulator/src/core';

import { persistProperty } from './persistProperty'
import { templateToChart } from '../../utils/template'
import { convertData } from '../../utils/dataParser'

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

export const visualSlice = createSlice({
    name: 'visual',
    initialState,
    reducers: {
        setHost: (state, action: PayloadAction<IVisualHost>) => {
            state.host = action.payload
        },
        setSettings: (state, action: PayloadAction<IVisualSettings>) => {
            state.settings = action.payload
        },
        setTemplate: (state, action: PayloadAction<Specification.Template.ChartTemplate>) => {
            state.template = action.payload

            const { chart } = templateToChart(state.template, state.dataset, state.mapping);

            state.chart = chart
        },
        setViewport: (state, action: PayloadAction<IViewport>) => {
            state.viewport = action.payload
        },
        setDataView: (state, action: PayloadAction<DataView>) => {
            state.dataview = action.payload
            const [dataset, selections] = convertData(state.dataview, state.host.createSelectionIdBuilder);
            state.dataset = dataset
            state.selections = selections

            
            const template = JSON.parse(state.settings.chart.template)
            const mapping = state.mapping

            state.template = template
            const { chart } = templateToChart(template, dataset, mapping)

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
            persistProperty(state.host, property.objectName, property.objectProperty, property.value);
        },
        setMapping: (state, action: PayloadAction<IColumnsMapping[]>) => {
            state.mapping = action.payload
            const { chart } = templateToChart(state.template, state.dataset, action.payload);
            state.chart = chart;
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
    setTemplate
} = visualSlice.actions

export default visualSlice.reducer
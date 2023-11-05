import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IVisualSettings, VisualSettings } from '../../settings'

import powerbi from "powerbi-visuals-api"
import IViewport = powerbi.IViewport
import DataView = powerbi.DataView
import EditMode = powerbi.EditMode
import ViewMode = powerbi.ViewMode
import IVisualHost = powerbi.extensibility.visual.IVisualHost

import { Dataset } from 'charticulator/src/core';

import { persistProperty } from './persistProperty'

export interface IUnmappedColumns {
    table: string,
    tableType: Dataset.TableType,
    column: string,
    columnType: Dataset.DataType,
    powerbiColumn: string
}

export interface VisualState {
    settings: IVisualSettings
    viewport: IViewport
    dataview: DataView
    mode: EditMode
    view: ViewMode
    solverInitialized: boolean
    host: IVisualHost
    unmappedColumns: IUnmappedColumns[]
}

export interface Property {
    objectName: string
    objectProperty: string
    value: string
}

const initialState: VisualState = {
    settings: VisualSettings.getDefault() as VisualSettings,
    viewport: {
        height: 0,
        width: 0
    },
    dataview: null,
    mode: EditMode.Default,
    solverInitialized: false,
    host: null,
    unmappedColumns: [],
    view: ViewMode.View
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
        setViewport: (state, action: PayloadAction<IViewport>) => {
            state.viewport = action.payload
        },
        setDataView: (state, action: PayloadAction<DataView>) => {
            state.dataview = action.payload
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
        setUnmappedColumn: (state, action: PayloadAction<IUnmappedColumns[]>) => {
            state.unmappedColumns = action.payload
        },
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
    setUnmappedColumn
} = visualSlice.actions

export default visualSlice.reducer
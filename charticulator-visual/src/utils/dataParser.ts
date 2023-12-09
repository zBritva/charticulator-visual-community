
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import ValueTypeDescriptor = powerbi.ValueTypeDescriptor;
import ISelectionIdBuilder = powerbi.extensibility.ISelectionIdBuilder;
import ISelectionId = powerbi.extensibility.ISelectionId;

import { utcParse, timeParse } from "d3-time-format";

import { Dataset } from "charticulator/src/container";

//2014-12-31T20:00:00.000Z
const timeFormat = '%Y-%m-%dT%H:%M:%S.000Z'
export const tooltipsTablename = "powerBITooltips"

export function mapColumnType(pbiType: ValueTypeDescriptor): Dataset.DataType {
    if (pbiType.bool) {
        return Dataset.DataType.Boolean;
    }
    if (pbiType.dateTime) {
        return Dataset.DataType.Date;
    }
    if (pbiType.enumeration) {
        return Dataset.DataType.String;
    }
    if (pbiType.integer) {
        return Dataset.DataType.Number;
    }
    if (pbiType.numeric) {
        return Dataset.DataType.Number;
    }
    if (pbiType.text) {
        return Dataset.DataType.String;
    }

    return Dataset.DataType.String;
}

export function mapColumnKind(pbiType: ValueTypeDescriptor): Dataset.DataKind {
    if (pbiType.bool) {
        return Dataset.DataKind.Categorical;
    }
    if (pbiType.dateTime) {
        return Dataset.DataKind.Temporal;
    }
    if (pbiType.enumeration) {
        return Dataset.DataKind.Categorical;
    }
    if (pbiType.integer) {
        return Dataset.DataKind.Numerical;
    }
    if (pbiType.numeric) {
        return Dataset.DataKind.Numerical;
    }
    if (pbiType.text) {
        return Dataset.DataKind.Categorical;
    }

    return Dataset.DataKind.Categorical;
}

export function convertData(
    dataView: DataView,
    createSelectionBuilder: () => ISelectionIdBuilder,
    utcTimeZone: boolean): [Dataset.Dataset | null, Map<number, ISelectionId> | null] {
    if (!dataView || !dataView.categorical) {
        return [null, null];
    }

    const dateParse = true ? utcParse(timeFormat) : timeParse(timeFormat);

    const categories = dataView.categorical.categories;
    const values = dataView.categorical.values;

    const mainTable: Dataset.Table = {
        displayName: "Main",
        name: "main",
        columns: [],
        rows: [],
        type: Dataset.TableType.Main
    }

    const tooltipsTable: Dataset.Table = {
        displayName: "Tooltips",
        name: tooltipsTablename,
        columns: [],
        rows: [],
        type: Dataset.TableType.Main
    }

    const mainTableSelectionIds = new Map<number, ISelectionId>();

    const linksTable: Dataset.Table = {
        displayName: "Links",
        name: "links",
        columns: [],
        rows: [],
        type: Dataset.TableType.Links
    }

    
    if (categories?.length || values?.length) {
        const allColumns = [...(categories ?? []), ...(values ?? [])];
        allColumns.forEach(category => {
            const source = category.source;
            const displayName = source.displayName;

            if (source.roles['primarykey'] && !mainTable.columns.find(c => c.displayName === displayName)) {
                mainTable.columns.push({
                    displayName,
                    name: displayName,
                    type: mapColumnType(source.type),
                    metadata: {
                        kind: mapColumnKind(source.type),
                    }
                });
            }

            if (source.roles['powerBITooltips'] && !tooltipsTable.columns.find(c => c.displayName === displayName)) {
                tooltipsTable.columns.push({
                    displayName,
                    name: displayName,
                    type: mapColumnType(source.type),
                    metadata: {
                        kind: mapColumnKind(source.type),
                    }
                });
            }

            if (source.roles['links'] && !linksTable.columns.find(c => c.displayName === displayName)) {
                linksTable.columns.push({
                    displayName,
                    name: displayName,
                    type: mapColumnType(source.type),
                    metadata: {
                        kind: mapColumnKind(source.type),
                    }
                });
            }
        });

        linksTable.rows = allColumns[0].values.map<Dataset.Row>((_cat, index) => {
            const row: Dataset.Row = {
                _id: `${index}`
            }

            linksTable.columns.forEach(column => {
                const categoryColumn = allColumns.find(category => category.source.displayName === column.displayName);

                row[column.displayName] = categoryColumn.values[index] as any; 
            })
            
            return row;
        });

        tooltipsTable.rows = allColumns[0].values.map<Dataset.Row>((_cat, index) => {
            const row: Dataset.Row = {
                _id: `${index}`
            }

            tooltipsTable.columns.forEach(column => {
                const categoryColumn = allColumns.find(category => category.source.displayName === column.displayName);

                row[column.displayName] = categoryColumn.values[index] as any; 
            })
            
            return row;
        });

        const uniqueIndex = new Set();
        mainTable.rows = [];
        allColumns[0].values.forEach((_cat, index) => {
            const builder = createSelectionBuilder();
            
            const selectionID = builder
                .withCategory(categories[0], index)
                .createSelectionId();
            mainTableSelectionIds.set(index, selectionID);

            const row: Dataset.Row = {
                _id: `${index}_`,
            }
            let rowID = `u_`;

            mainTable.columns.forEach(column => {
                const categoryColumn = allColumns.find(category => category.source.displayName === column.displayName);

                if (column.type === Dataset.DataType.Date) {
                    if (typeof categoryColumn.values[index] === 'string') {
                        row[column.displayName] = dateParse(categoryColumn.values[index] as any).getTime() as any;
                    }
                } else {
                    row[column.displayName] = categoryColumn.values[index] as any;
                }

                rowID += String(categoryColumn.values[index])
                    .toLocaleLowerCase()
                    .replace(/\s/, '_')
                    .concat('_')
            });

            // if no links data, add all data
            if (!uniqueIndex.has(rowID) || linksTable.rows.length == 0) {
                mainTable.rows.push(row);
                uniqueIndex.add(rowID);
            }
        });
    }

    return [
        {
            name: "main",
            tables: [
                mainTable,
                linksTable,
                tooltipsTable
            ].filter(table => table.columns.length)
        },
        mainTableSelectionIds
    ];
}
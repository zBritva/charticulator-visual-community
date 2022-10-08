
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;

import { Dataset } from "charticulator/src/container";


export function convertData(dataView: DataView): Dataset.Dataset | null {

    if (!dataView || !dataView.categorical) {
        return null;
    }

    const categories = dataView.categorical.categories;
    const values = dataView.categorical.values;

    debugger;
    const mainTable: Dataset.Table = {
        displayName: "Main",
        name: "main",
        columns: [],
        rows: [],
        type: Dataset.TableType.Main
    }

    const linksTable: Dataset.Table = {
        displayName: "Links",
        name: "links",
        columns: [],
        rows: [],
        type: Dataset.TableType.Links
    }

    if (categories?.length || values?.length) {
        const allColumns = [...categories, ...values];
        allColumns.forEach(category => {
            const source = category.source;
            const displayName = source.displayName;

            if (source.roles['primarykey']) {
                mainTable.columns.push({
                    displayName,
                    name: displayName,
                    type: Dataset.DataType.String,
                    metadata: {
                        kind: Dataset.DataKind.Categorical,
                    }
                });
            }

            if (source.roles['links']) {
                linksTable.columns.push({
                    displayName,
                    name: displayName,
                    type: Dataset.DataType.String,
                    metadata: {
                        kind: Dataset.DataKind.Categorical,
                    }
                });
            }
        });

        mainTable.rows = allColumns[0].values.map<Dataset.Row>((_cat, index) => {
            const row: Dataset.Row = {
                _id: "index" + index
            }

            mainTable.columns.forEach(column => {
                const categoryColumn = allColumns.find(category => category.source.displayName === column.displayName);

                row[column.displayName] = categoryColumn.values[index] as any; 
            })
            
            return row;
        });

        linksTable.rows = allColumns[0].values.map<Dataset.Row>((_cat, index) => {
            const row: Dataset.Row = {
                _id: "index" + index
            }

            linksTable.columns.forEach(column => {
                const categoryColumn = allColumns.find(category => category.source.displayName === column.displayName);

                row[column.displayName] = categoryColumn.values[index] as any; 
            })
            
            return row;
        });
    }

    debugger;
    return {
        name: "main",
        tables: [
            mainTable,
            linksTable
        ].filter(table => table.columns.length)
    }
}
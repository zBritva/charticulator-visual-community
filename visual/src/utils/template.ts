import { ChartTemplate, Dataset, Specification } from "charticulator/src/container";
import { IColumnsMapping } from "../redux/slices/visualSlice";
import { UnmappedColumnName } from "../views/Mapping";

export function createChartFromTemplate(template: string, dataset: Dataset.Dataset, unmappedColumns: any) {
    const chartJSON = JSON.parse(template);
    const chartTemplate = new ChartTemplate(
        chartJSON
    );

    const chartTables = chartJSON.tables;
    const newUnmappedColumns: IColumnsMapping[] = [];
    // tweak tables for old templates
    if (chartTables[0] != undefined && chartTables[0]?.type === undefined) {
        chartTables[0].type = Dataset.TableType.Main;
    }
    if (chartTables[1] != undefined && chartTables[1].type === undefined) {
        chartTables[1].type = Dataset.TableType.Links;
    }

    debugger;
    chartTables.forEach((table: any) => {
        chartTemplate.assignTable(
            table.name,
            table.name
        );

        const datasetTable = dataset.tables.find(t => table.type == t.type);

        table.columns.forEach((column: any) => {
            const datasetColumn = datasetTable?.columns.find(c => c.name === column.name || unmappedColumns.find(uc => uc.powerbiColumn == c.name))

            if (datasetColumn) {
                chartTemplate.assignColumn(
                    table.name,
                    column.name,
                    datasetColumn.name
                );
            } else {
                newUnmappedColumns.push({
                    table: table.name,
                    tableType: table.type,
                    column: column.name,
                    columnType: column.type,
                    powerbiColumn: UnmappedColumnName
                });
            }
        })
    });

    if (newUnmappedColumns.filter(c => c.powerbiColumn === UnmappedColumnName).length === 0) {
        const instance = chartTemplate.instantiate(dataset);
        const { chart } = instance;

        return { unmappedColumns: newUnmappedColumns, chart };
    } else {
        return { unmappedColumns: newUnmappedColumns, chart: null };
    }
}
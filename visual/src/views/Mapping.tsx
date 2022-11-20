import React from 'react';

// import { MappingColumns } from './utils';

import { Dropdown, PrimaryButton, IDropdownOption } from "@fluentui/react"
import { Dataset } from 'charticulator/src/core';

export interface IUnmappedColumns {
    table: string,
    tableType: Dataset.TableType,
    column: string,
    columnType: Dataset.DataType,
    powerbiColumn: string
}

export const UnmappedColumnName = 'unmapped';

export interface MappingProps {
    // mapping: any[];
    unmappedColumns: any[];
    dataset: Dataset.Dataset,
    onConfirmMapping: (newMapping: any[]) => void;
}

export const Mapping: React.FC<MappingProps> = ({
    // mapping,
    unmappedColumns,
    dataset,
    onConfirmMapping
}) => {
    const [mappingState, setMapping] = React.useState<IUnmappedColumns[]>(unmappedColumns);

    React.useEffect(() => {
        if (unmappedColumns != mappingState) {
            setMapping(unmappedColumns);
        }
    }, [unmappedColumns]);

    const buttonDisabled = mappingState.filter(item => item.powerbiColumn === UnmappedColumnName).length > 0;
    const onConfirm = React.useCallback(() => {
        onConfirmMapping(mappingState);
    }, [mappingState, onConfirmMapping]);

    return (
        <div className="mapping">
            <h1>
                {'Columns mapping'}
            </h1>
            <p>
                {'Map data coumns to chart columns. The template will be updated to use new columns names taken from dataset'}
            </p>
            <table>
                <thead>
                    <tr>
                        <th>
                            {'Template column'}
                        </th>
                        <th>
                            {'Data type'}
                        </th>
                        <th>
                            {'Data set column'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        // Numberundefinedxsrc
                        mappingState.map((item, mappingIndex) => {
                            const key = item.powerbiColumn ? item.powerbiColumn : UnmappedColumnName;
                            return (
                                <tr key={`${item.column.replace(/\s/g,"_")}-${(item.powerbiColumn || UnmappedColumnName)}-${item.columnType}-${mappingIndex}`}>
                                    <td>
                                        <span>{item.column}</span>
                                    </td>
                                    <td>
                                        <span>{item.columnType}</span>
                                    </td>
                                    <td className="columns">
                                        <Dropdown
                                        options={
                                            dataset
                                                .tables
                                                .filter(t => t.type === item.tableType)
                                                .flatMap(t => {
                                                    return t.columns.map(c => ({
                                                        key: `key${c.name}-${c.type}`,
                                                        text: c.displayName,
                                                        selected: c.name === item.powerbiColumn,
                                                        data: c.name
                                                    })).concat([{
                                                        key: `key${UnmappedColumnName}-unknown`,
                                                        text: UnmappedColumnName,
                                                        selected: UnmappedColumnName === item.powerbiColumn,
                                                        data: UnmappedColumnName
                                                    }]);
                                                })
                                            }
                                        onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
                                            const unmappedcolumn = mappingState.find((c) => c.column === item.column);
                                            if (unmappedcolumn) {
                                                unmappedcolumn.powerbiColumn = option.data;
                                                setMapping([
                                                    ...mappingState
                                                ]);
                                            }
                                        }}    
                                        >
                                        </Dropdown>
                                    </td>
                                </tr>
                            )
                        })      
                    }
                </tbody>
            </table>
            <PrimaryButton
                disabled={buttonDisabled}
                title={"Confirm"}
                type="primary" className="button confirm"
                onClick={onConfirm} >
                {"confirm"}
            </PrimaryButton>
        </div>
    )
}
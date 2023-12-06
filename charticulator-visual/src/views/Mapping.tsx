import React from 'react';

import { Button } from '@fluentui/react-button';
import { Dropdown, Option } from "@fluentui/react-combobox";

import { Dataset } from 'charticulator/src/core';
import { IColumnsMapping } from 'src/redux/slices/visualSlice';

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
    const [mappingState, setMapping] = React.useState<IColumnsMapping[]>(unmappedColumns);

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
                            const key = `${item.column.replace(/\s/g, "_")}-${(item.powerbiColumn || UnmappedColumnName)}-${item.columnType}-${mappingIndex}`
                            return (
                                <tr key={key}>
                                    <td>
                                        <span>{item.column}</span>
                                    </td>
                                    <td>
                                        <span>{item.columnType}</span>
                                    </td>
                                    <td className="columns">
                                        <Dropdown
                                            value={item.powerbiColumn}
                                            onOptionSelect={(_event, { optionValue }) => {
                                                const unmappedcolumn = mappingState.find((c) => c.column === item.column);
                                                if (unmappedcolumn) {
                                                    unmappedcolumn.powerbiColumn = optionValue;
                                                    setMapping([
                                                        ...mappingState
                                                    ]);
                                                }
                                            }}
                                        >
                                        {
                                            dataset
                                            .tables
                                            .filter(t => t.type === item.tableType)
                                            .flatMap(t => {
                                                return t.columns.map(c => ({
                                                    key: `key${c.name}-${c.type}`,
                                                    text: c.displayName,
                                                    value: c.displayName,
                                                    selected: c.name === item.powerbiColumn,
                                                    data: c.name
                                                })).concat([{
                                                    key: `key${UnmappedColumnName}-unknown`,
                                                    text: UnmappedColumnName,
                                                    value: UnmappedColumnName,
                                                    selected: UnmappedColumnName === item.powerbiColumn,
                                                    data: UnmappedColumnName
                                                }]);
                                            })
                                            .map(o => {
                                                return (<Option key={o.key} value={o.value} text={o.text} >{o.text}</Option>)
                                            })
                                        }
                                        </Dropdown>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Button
                appearance='primary'
                disabled={buttonDisabled}
                title={"Confirm"}
                className="button confirm"
                onClick={onConfirm} >
                {"Confirm"}
            </Button>
        </div>
    )
}
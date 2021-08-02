import React, { useState, useEffect } from 'react'
import { Icon, List, Header, Container, Table, Button, Form, Input } from 'semantic-ui-react'

const DataRow = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [value, setValue] = useState(props.entry.value)

    const deleteRow = () => {
        fetch(`/data/${props.entry.key}`, { method: "DELETE" })
            .then(() => {
                props.onChange();
            })
    }


    const saveRow = () => {
        const postOptions = {
            method: "POST",

            body: JSON.stringify({ value })
        }
        console.log(postOptions);
        fetch(`/data/${props.entry.key}`, postOptions)
            .then(() => {
                props.onChange({ key: props.entry.key, value: value })
                setIsEdit(false)
            })
    }

    return (
        <Table.Row key={props.entry.key}>
            <Table.Cell>{props.entry.key}</Table.Cell>
            <Table.Cell>
                {isEdit ?
                    <Input
                        placeholder="value..."
                        value={typeof value === "object" ? JSON.stringify(value) : value}
                        onChange={(_, data) => {
                            console.log(data);
                            setValue(data.value)
                        }}
                    />
                    :
                    typeof props.entry.value === "object" ? JSON.stringify(props.entry.value) : props.entry.value
                }
            </Table.Cell>
            <Table.Cell>
                {isEdit
                    ? <>
                        <Button primary onClick={saveRow}>Save</Button>
                        <Button red onClick={() => { setIsEdit(false); }}>Cancel</Button>
                    </>
                    : <>
                        <Button primary onClick={() => { setIsEdit(true); }}>Edit</Button>
                        <Button red onClick={deleteRow}>Delete</Button>
                    </>}

            </Table.Cell>
        </Table.Row>
    );
}

const DataStore = () => {
    const [data, setData] = useState([]);
    const [newEntry, setNewEntry] = useState({ key: "", value: "" });

    useEffect(() => {
        fetch('/data')
            .then(async (response) => {
                if(response.status ==200) {
                let data = await response.json()
                    let newData = Object.keys(data).map(k => { return { key: k, value: data[k] } })
                    console.log(newData);
                    setData(newData);
            }
            })
    }, [])

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Key</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>
                        <Input
                            placeholder="New Key..."
                            value={newEntry.key}
                            onChange={(_, {value}) => {
                                setNewEntry({...newEntry, key: value})
                            }}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Input
                            placeholder="New value..."
                            value={newEntry.value}
                            onChange={(_, {value}) => {
                                setNewEntry({...newEntry, value})
                            }}
                        />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button primary onClick={() => {
                            const options = {
                                method: "PUT",
                                body: JSON.stringify(newEntry)
                            }
                            fetch(`/data`, options)
                                .then(() => {
                                    setData([newEntry, ...data])
                                    setNewEntry({ key: "", value: "" })
                                })

                        }}>Add</Button></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(d => <DataRow
                    key={d.key}
                    entry={d}
                    onChange={(newValue) => {
                        newValue ?
                            setData(data.map(d => d.key === newValue.key ? newValue : d))
                            :
                            setData(data.filter(da => da.key !== d.key))
                    }} />
                )}
            </Table.Body>
        </Table>
    )
}

export default DataStore;
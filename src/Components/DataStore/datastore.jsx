import React, { useState, useEffect } from 'react'
import { Icon, List, Header, Container, Table, Button, Form, Input } from 'semantic-ui-react'

const DataRow = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [value, setValue] = useState(props.entry.value)

    const requestOptions = {
        method: "DELETE"
    }

    const deleteRow = () => {
        fetch(`/data/${props.entry.key}`, requestOptions)
        .then(() => {
            props.onChange()
        })
    } 


    const saveRow = () => {
        const postOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: {value}
        }
        fetch(`/data/${props.entry.key}`, postOptions)
        .then(() => {
            props.onChange({key: props.entry.key, value: value})
        })
    }
    
    return (<Table.Row key={props.entry.key}>
        <Table.Cell>{props.entry.key}</Table.Cell>
        <Table.Cell>{isEdit ? <Input placeholder="value..." value={value} onChange={(_, {value}) => {
            setValue(value)
        }}></Input> : props.entry.value }</Table.Cell>
        <Table.Cell>
            {isEdit 
            ? <Fragment>
                <Button primary onClick={saveRow}>Save</Button>
                <Button red onClick={setIsEdit(false)}>Cancel</Button>
            </Fragment> 
            : <Fragment>
                <Button primary onClick={setIsEdit(true)}>Edit</Button>
                <Button red onClick={deleteRow}>Delete</Button>    
            </Fragment>}

        </Table.Cell>
    </Table.Row>)
}

const DataStore = (props) => {
    const [data, setData] = useState([]);
    // const [showDevices, setShowDevices] = useState(false);
    // const [showGroups, setShowGroups] = useState(false);
    // const [values, setValues] = useState(initial)



    useEffect(() => {
        const getOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        fetch('/data', getOptions)
            .then(response => response.json())
            .then(data => setData(Object.keys(data).map(k => { return { key: k, value: data } })))
    }, [])

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Key</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(d => {return <DataRow entry={d} onChange={(newValue) => 
                {
                    if (newValue) {
                        setData(data.map(d => d.key === newValue.key ? newValue : d ))
                    } else {
                        setData(data.filter(da => da.key !== d.key))
                    }
                }}/>})}
            </Table.Body>
        </Table>
    )
}
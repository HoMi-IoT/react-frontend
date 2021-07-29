import React, { useState } from 'react'
import { Grid, List, Button, Checkbox, Segment, SegmentGroup, Dropdown, Header, Input, Icon } from 'semantic-ui-react';

const Rules = () => {

    return (
        <Grid columns='2' divided>
            <Grid.Row>
                <Grid.Column width='4' >
                    <RulesList rules={[1, 2, 3, 4]} />
                </Grid.Column>
                <Grid.Column width='12' >
                    <RulesForm />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

}

const RulesList = ({ rules }) => {
    return (
        <List divided relaxed>
            <List.Item>
                <List.Content floated='right' >
                    <Button onClick={() => { console.log("cleared"); }}>Clear selection</Button>
                </List.Content>
                <List.Header as='h4' >Saved Rules</List.Header>
            </List.Item>
            {rules.map((rule) => {
                return (
                    <List.Item key={rule}>
                        <List.Icon name='cogs' size='large' verticalAlign='middle' />
                        <List.Content onClick={() => { console.log("11111"); }}>
                            <List.Header as="a">{rule}</List.Header>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    );
}

let timeOptions = ["AM", "PM"].map(s => Array.from(Array(12).keys()).map(t => { return { key: `${t < 10 ? `0${t}` : t}:00 ${s}`, text: `${t < 10 ? `0${t}` : t}:00 ${s}`, value: `${t < 10 ? `0${t}` : t}:00 ${s}` } }));
timeOptions = [...timeOptions[0], ...timeOptions[1]]

const RulesForm = ({ rule }) => {
    const [withTime, setWithTime] = useState(rule);
    const [times, setTimes] = useState({});
    const [conditions, setConditions] = useState([{ key: '', condition: 'is', value: '' }])
    return (
        <SegmentGroup>
            <Segment basic>
                <Header as='h3'> Time Constraints <Checkbox toggle defaultChecked={withTime} onChange={(_, { checked }) => { setWithTime(checked) }} /> </Header>
                {withTime ?
                    <Segment basic textAlign='center'>
                        between <Dropdown
                            placeholder="start time"
                            search
                            options={timeOptions}
                            onChange={(_, { value }) => { setTimes({ ...times, startTime: value }) }} />
                        &nbsp;and&nbsp;
                        <Dropdown
                            placeholder="end time"
                            search
                            options={timeOptions}
                            onChange={(_, { value }) => { setTimes({ ...times, endTime: value }) }} />
                    </Segment>
                    :
                    null}
            </Segment>

            <Segment basic>
                <Header as='h3'>Conditions</Header>
                {conditions.map((condition, i) => {
                    return (<Segment basic textAlign='center' key={i}>
                        if  <Input
                            placeholder="Data key..."
                            value={condition.key}
                            onChange={(_, data) => {
                                setConditions(conditions.map(c => {
                                    if (c === condition)
                                        return { ...condition, key: data.value }
                                    return c
                                }))
                            }}
                        />&nbsp;
                        <Dropdown 
                        options={[
                            { key: 1, text: "is", value: "is" },
                            { key: 2, text: ">", value: "gt" },
                            { key: 3, text: ">", value: "gte" },
                            { key: 4, text: "<", value: "lt" },
                            {
                                key: 4, text: "<=", value: "lte"
                            }]}
                            simple item value={condition.condition}
                            onChange={(_, data) => {
                                setConditions(conditions.map(c => {
                                    if (c === condition)
                                        return { ...condition, condition: data.value }
                                    return c
                                }))
                            }} 
                            />&nbsp;
                        <Input 
                        placeholder={condition.condition==="is"?"Value...":"Numeric value..."} 
                        value={condition.value}
                        type={condition.condition==="is"?"text":"number"}
                        onChange={(_, data) => {
                            setConditions(conditions.map(c => {
                                if (c === condition)
                                    return { ...condition, value: data.value }
                                return c
                            }))
                        }}
                        />&nbsp;
                        {conditions.length > 1 ? <Button basic icon onClick={() => { setConditions(conditions.filter(c => c !== condition)) }}>
                            <Icon name='trash' color='red' />
                        </Button> : null}
                    </Segment>)

                })}

                <Button icon labelPosition='left' onClick={()=>{setConditions(conditions.concat({ key: '', condition: 'is', value: '' }))}}>
                    <Icon name='plus' />
                    add condition
                </Button>
            </Segment>

            <Segment basic>
                <Header as='h3'>Action</Header>
                <Segment basic textAlign='center'> Run <Dropdown options={[{ key: 1, text: "Script", value: "Script" }, { key: 2, text: "Service", value: "Service" }]} simple item defaultValue="Script" /> <Input placeholder="action..." /> with <Input placeholder="arg1, arg2..." /></Segment>
            </Segment>
        </ SegmentGroup>
    );
}

export default Rules;
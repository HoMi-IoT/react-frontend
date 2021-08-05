import React, { useEffect, useState } from 'react'
import { Grid, List, Button, Checkbox, Segment, SegmentGroup, Dropdown, Header, Input, Icon } from 'semantic-ui-react';

const Rules = () => {
    const [rules, setRules] = useState([]);
    const loadRules = ()=>{
        fetch('/rules')
                .then(async res => {
                    if(res.status ==200) {
                        let data = await res.json()
                        setRules( Object.keys(data).map(k => { return { id: k, text: data[k] } }))
                }});
    }
    useEffect(()=>{
        loadRules()
    }, [])
    return (
        <Grid columns='2' divided>
            <Grid.Row>
                <Grid.Column width='4' style={{overflow: "auto"}}>
                    <RulesList rules={rules} />
                </Grid.Column>
                <Grid.Column width='12' >
                    <RulesForm onAdd={loadRules}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

}

const RulesList = ({ rules }) => {
    return (
        <List divided relaxed>
            <List.Item>
                {/* <List.Content floated='right' >
                    <Button onClick={() => { console.log("cleared"); }}>Clear selection</Button>
                </List.Content> */}
                <List.Header as='h4' >Saved Rules</List.Header>
            </List.Item>
            {rules.map((rule) => {
                let t = rule.text.split("\n");
                t[0] = "if " + t[0];
                t[1] = t[1];
                return (
                    <List.Item key={rule.id}>
                        <List.Icon name='cogs' size='large' verticalAlign='middle' />
                        <List.Content onClick={() => { console.log("11111"); }}>
                            <List.Header as="a"><pre>{t.join("\n")}</pre></List.Header>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    );
}

let timeOptions = ["AM", "PM"].map(s => Array.from(Array(12).keys()).map(t => { return { key: `${t < 10 ? `0${t}` : t}:00 ${s}`, text: `${t < 10 ? `0${t}` : t}:00 ${s}`, value: `${t < 10 ? `0${t}` : t}:00 ${s}` } }));
timeOptions = [...timeOptions[0], ...timeOptions[1]]

const RulesForm = ({ onAdd }) => {
    const [withTime, setWithTime] = useState(false);
    const [times, setTimes] = useState({});
    const [conditions, setConditions] = useState([{ key: '', condition: 'is', value: '' }])
    const [action, setAction] = useState({ type: 'script', command: '', arguments: [] })
    const [rest, setRest] = useState(0)
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
                            { key: 2, text: "=", value: "gt" },
                            { key: 3, text: ">", value: "gt" },
                            { key: 4, text: "<", value: "lt" }]}
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
                <Segment basic textAlign='center'> Run <Dropdown 
                options={[{ key: 1, text: "script", value: "script" }, { key: 2, text: "service", value: "service" }]} 
                simple 
                item 
                value={action.type} 
                onChange={(e,{value})=>{setAction({...action, type:value})}}/> <Input 
                placeholder="action..." 
                value={action.command} 
                onChange={(e,{value})=>{setAction({...action, command: value})}}/> with <Input 
                placeholder="arg1, arg2..." 
                value={action.arguments.join(",")}
                onChange={(e, {value})=>{
                    setAction({...action, arguments: value.split(",").map(v=>v.trim())})
                }}/>
                </Segment>
            </Segment>
            <Segment basic>
                <Header as='h3'>Rest Time</Header>
                <Input 
                placeholder="rest time in ms"
                type="number" 
                value={rest} 
                onChange={(e,{value})=>{setRest(value)}}/>

            </Segment>
            <Button attached="bottom" primary content="Add Rule" onClick={()=>{
                let rule = "";
                if(withTime)
                    alert("timed condition not implemnted yet");
                rule+= conditions.map(({key, condition, value}) => `${key} ${condition} ${value}`).join(" and ") + "\n";
                rule+= `invoke ${action.type} ${action.command} ${action.arguments.join(" ")}\n`;
                rule+= `rest time ${rest}`;
                fetch('/rules', { method: "POST", body: rule })
                .then(res => {
                    if(res.status ==200) {
                        onAdd()
                }});
                
            }}/>
        </ SegmentGroup>
    );
}

export default Rules;
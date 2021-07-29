import React, { useState } from 'react'
import { Grid, List, Button, Checkbox, Segment, SegmentGroup, Dropdown, Header, Input } from 'semantic-ui-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const Scripting = () => {

    return (


        <Grid columns='2' divided>
            <Grid.Row>
                <Grid.Column width='4' >
                    <ScriptList scripts={[1, 2, 3, 4]} />
                </Grid.Column>
                <Grid.Column width='12' >
                    <ScriptEditor />
                </Grid.Column>
            </Grid.Row>
        </Grid>);
}

const ScriptList = ({ scripts }) => {

    return (
        <List divided relaxed>
            <List.Item>
                <List.Header as='h4' >Saved Scripts</List.Header>
            </List.Item>
            {scripts.map((script) => {
                return (
                    <List.Item key={script}>
                        <List.Icon name='code' size='large' verticalAlign='middle' />
                        <List.Content onClick={() => { console.log("11111"); }}>
                            <List.Header as="a">{script.name}</List.Header>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    );
}

const ScriptEditor = ({script}) => {

    const [code, setCode] = useState(script? script.code: "");
    const [scriptName, setScriptName] = useState(script? script.name: "");
    return <Segment>
        <Header>Editor <Input
            placeholder="Script name.."
            value={scriptName}
            onChange={(_, data) => {
                setScriptName(data.value)
            }}
            action={{content: "save", onClick: ()=>{console.log("save me");}}}
        /></Header>
        
        <Segment style={{
            backgroundColor: 'rgba(200,200,200, 0.2)'
        }}>
            <Editor
                value={code}
                onValueChange={setCode}
                highlight={code => highlight(code, languages.js)}
                tabSize={4}
                insertSpaces

                padding={10}
                placeholder={'type your code here...'}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                    minHeight: '10em'
                }}
            /></Segment>
        <Button attached='bottom' content="run" />
    </Segment>
}

export default Scripting;
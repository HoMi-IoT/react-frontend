import React, { useEffect, useState } from 'react'
import { Grid, List, Button, Segment, Header, Input } from 'semantic-ui-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const Scripting = () => {
    const [scripts, setScripts] = useState([]);
    const [clickedScript, setClickedScript] = useState(undefined);
    useEffect(
        ()=>{
        fetch('/scripting')
        .then(res =>res.json())
        .then(data => {
            let ks = Object.keys(data).filter(keyVal => !["_revision", "_id", "_modified"].includes(keyVal));
            setScripts(ks.map(k=>{ return {name: k, code: data[k]}}))
        });
    },[]);
    const onSaveScript = (name, code)=>{
        console.log("called");
        for(let s of scripts){
            if(s.name === name){
               return setScripts(scripts.map(script => s === script? {name, code} : script));
            }
        }
        setScripts([...scripts, {name, code}]);
    }

    return (
        <Grid columns='2' divided>
            <Grid.Row>
                <Grid.Column width='4' >
                    <ScriptList scripts={scripts} onClick={setClickedScript}/>
                </Grid.Column>
                <Grid.Column width='12' >
                    <ScriptEditor script={clickedScript} onSave={onSaveScript} />
                </Grid.Column>
            </Grid.Row>
        </Grid>);
}

const ScriptList = ({ scripts, onClick }) => {

    return (
        <List divided relaxed>
            <List.Item>
                <List.Header as='h4' >Saved Scripts</List.Header>
            </List.Item>
            {scripts.map((script) => {
                return (
                    <List.Item key={script.name}>
                        <List.Icon name='code' size='large' verticalAlign='middle' />
                        <List.Content onClick={() => { onClick(script) }}>
                            <List.Header as="a">{script.name}</List.Header>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    );
}

const ScriptEditor = ({script, onSave}) => {

    const [code, setCode] = useState("");
    const [scriptName, setScriptName] = useState("");
    useEffect(()=>{
        if(script){
            setCode(script.code);
            setScriptName(script.name);
        }
    },[script])
    const runScript = () => {
        fetch('/scripting', {method:"POST", body:code})
        .then(res => res.text())
        .then(text =>{console.log(text);})
    }

    const saveScript = () => {
        fetch(`/scripting/${scriptName}`, {method:"PUT", body:code})
        .then(res => res.text())
        .then(text =>{ console.log(text); if(text.toLowerCase() === "script saved") onSave(scriptName, code)})
    }

    return <Segment>
        <Header>Editor <Input
            placeholder="Script name.."
            value={scriptName}
            onChange={(_, data) => {
                setScriptName(data.value)
            }}
            action={{content: "save", onClick: saveScript}}
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
        <Button attached='bottom' content="run" onClick={runScript}/>
    </Segment>
}

export default Scripting;
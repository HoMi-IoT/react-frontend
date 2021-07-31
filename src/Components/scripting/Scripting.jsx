import React, { useEffect, useState } from 'react'
import { Grid, List, Button, Segment, Header, Input, SegmentGroup } from 'semantic-ui-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const Scripting = () => {
    const [scripts, setScripts] = useState([]);
    const [clickedScript, setClickedScript] = useState(undefined);
    const [output, setOutput] = useState("");

    useEffect(
        () => {
            fetch('/scripting')
                .then(res => res.json())
                .then(data => {
                    let ks = Object.keys(data).filter(keyVal => !["_revision", "_id", "_modified"].includes(keyVal));
                    setScripts(ks.map(k => { return { name: k, code: data[k] } }))
                });
        }, []);

    const onSaveScript = (name, code) => {
        console.log("called");
        for (let s of scripts) {
            if (s.name === name) {
                return setScripts(scripts.map(script => s === script ? { name, code } : script));
            }
        }
        setScripts([...scripts, { name, code }]);
    }

    return (
        <Grid columns='2' divided>
            <Grid.Row>
                <Grid.Column width='4' >
                    <ScriptList scripts={scripts} onClick={setClickedScript} />
                </Grid.Column>
                <Grid.Column width='12' >
                    <SegmentGroup>
                        <ScriptEditor script={clickedScript} onSave={onSaveScript} onOutput={(text) => { setOutput(`${output}\>>\n${text}`) }} />
                        <Output output={output} onClear={() => { setOutput("") }} />
                    </SegmentGroup>
                </Grid.Column>
            </Grid.Row>
        </Grid>);
}


const Output = ({ output, onClear }) => {
    return (
        <Segment color="black" attached="top" as="pre" style={{
            minHeight: '20vh',
            maxHeight: '50vh',
            overflow: 'auto',
            color: "green",
            backgroundColor: "rgba(25,25,25,1)"
        }}
        >
            {output}
        </Segment>
    )
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

const ScriptEditor = ({ script, onSave, onOutput }) => {

    const [code, setCode] = useState("");
    const [scriptName, setScriptName] = useState("");
    const [loading, setLoading] = useState("");
    useEffect(() => {
        if (script) {
            setCode(script.code);
            setScriptName(script.name);
        }
        setLoading(false);
    }, [script])

    const runScript = () => {
        
        setLoading(true);
        fetch('/scripting', { method: "POST", body: code })
            .then(res => res.text())
            .then(text => {
                console.log(text);
                onOutput(text);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                onOutput("an error occured: see details in browser console");
                setLoading(false);
            })
    }

    const saveScript = () => {
        fetch(`/scripting/${scriptName}`, { method: "PUT", body: code })
            .then(res => res.text())
            .then(text => { console.log(text); if (text.toLowerCase() === "script saved") onSave(scriptName, code) })
    }

    return <Segment>
        <Header>Editor <Input
            placeholder="Script name.."
            value={scriptName}
            onChange={(_, data) => {
                setScriptName(data.value)
            }}
            action={{ content: "save", onClick: saveScript }}
        /></Header>

        <Segment style={{
            backgroundColor: 'rgba(200,200,200, 0.2)',
            maxHeight: '50vh',
            overflow: 'auto'
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
                    minHeight: '10em',
                }}
            /></Segment>
        <Button loading={loading} attached='bottom' content="run" onClick={runScript} />
    </Segment>
}

export default Scripting;
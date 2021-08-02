import React, { useState, useEffect } from 'react'
import { Icon, List, Header, Container, Table, Button, Form } from 'semantic-ui-react'
import deviceArr from "./DeviceData"

const initial = {
  dname: '',
  addresskeys: '',
  addressvalues: '',
  attributekeys: '',
  attributevalues: '',
  groups: ''
}

//add a mac button to /bluetooth/connect



const DeviceList = (props) => {
  const [devices, setDevices] = useState([]);
  const [showDevices, setShowDevices] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [values, setValues] = useState(initial)

  useEffect(() => {
    const getOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    fetch('/devices', getOptions)
      .then(response => response.json())
      .then(data => setDevices(data))
    // setDevices(deviceArr)
  }, [])

  function combineKV(key, value) {

    var obj = {}
    for (var i = 0; i < key.length; i++) {

      obj[key[i].trim()] = value[i].trim()
    }
    return obj
  }

  const handleDeleteDevice = param => (e => {
    //make a post call to backend to delete then delete from local copy
    const deleteOptions = {
      method: 'DELETE',
    }
    var url = '/devices/id/' + param
    console.log(url)

    fetch(url, deleteOptions)
      .then(response => response.text())
      .then(text => { if (text === "Device deleted") setDevices(devices.filter((item) => item.name !== param)) })
      .catch(error => { alert("error"); console.error(error); });
  })

  const handleNameChange = (e => {

    setValues((values) => ({
      ...values,
      dname: e.target.value
    }));
  });

  const handleAddressKeyChange = (e => {
    setValues((values) => ({
      ...values,
      addresskeys: e.target.value
    }));
  });

  const handleAddressValChange = (e => {
    setValues((values) => ({
      ...values,
      addressvalues: e.target.value
    }));
  });

  const handleAttributeKeyChange = (e => {
    setValues((values) => ({
      ...values,
      attributekeys: e.target.value
    }));
  });

  const handleAttributeValChange = (e => {
    setValues((values) => ({
      ...values,
      attributevalues: e.target.value
    }));
  });

  const handleGroupChange = (e => {
    setValues((values) => ({
      ...values,
      groups: e.target.value
    }));
  });

  const handleSubmit = (e => {
    if (values.dname === '') {
      alert("Must enter a device name!")
      return
    }
    var dname = values.dname
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].name === dname) {
        alert("Device name already exists. Please enter a different name.")
        return
      }
    }
    var address = {}
    if (values.addresskeys.trim() !== "" && values.addressvalues.trim() !== "") {
      var addrk = values.addresskeys.split(',')
      var addrv = values.addressvalues.split(',')
      address = combineKV(addrk, addrv)
    } 
    var attribute = {}

    if (values.attributekeys.trim() !== "" && values.attributevalues.trim() !== "") {
      var attrk = values.attributekeys.split(',')
      var attrv = values.attributevalues.split(',')
      attribute = combineKV(attrk, attrv)
    }

    var group = values.groups.split(',')
    var device = {
      name: dname,
      addresses: address,
      attributes: attribute,
      groups: group
    }
    setValues(initial);
    const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    }
    fetch('/devices', postOptions)
      .then(response => response.text())
      .then(data => { console.log(data); setDevices([...devices, device]) })

    alert('New device ' + dname + ", form submitted.")
    //handle form submit and device adding
    e.preventDefault()
  })

  let groups = [];
  devices.map(device => {
    groups.push(...device.groups)
  }) //offload this to useEffect [] to run once

  const handleShowDevices = () => {
    setShowDevices(true)
  }
  const handleHideDevices = () => {
    setShowDevices(false)
  }

  const handleShowGroups = () => {
    setShowGroups(true)
  }

  const handleHideGroups = () => {
    setShowGroups(false)
  }

  const handleConnectBT = mac => (async e => {
    console.log("bt param:", mac)
    const ble = {
      "mac": mac,
    }
    const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ble)
    }

    await fetch("/bluetooth/connect", postOptions)
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => alert("error"))
  })


  const getDevicesInGroup = (groupName) => {
    let d = []
    devices.map(device => {
      if (device.groups.includes(groupName)) {
        d.push(device.name)
      }
    })
    return d
  }

  return (
    <Container>
      <Header as='h2' dividing>
        Devices
      </Header>
      <Table celled>
        <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Device</Table.HeaderCell>
              <Table.HeaderCell>Addresses</Table.HeaderCell>
              <Table.HeaderCell>Attributes</Table.HeaderCell>
              <Table.HeaderCell>Groups</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
        {showDevices && devices.map(device => (
          
            <Table.Row key={device.name}>
              <Table.Cell style={{width:"35%"}}>
                <Header as='h4' image>
                  <Icon name='mobile alternate' />
                  <Header.Content>
                    {device.name}
                  </Header.Content>
                </Header>
                <Button basic compact floated={'right'} color='red' onClick={handleDeleteDevice(device.name)}>Delete</Button>
              </Table.Cell>
              <Table.Cell>
                <List>
                  {Object.entries(device.addresses).map(
                    ([key, value]) => {
                      return key === "BT_MAC" ? (
                        <List.Item>
                          <List.Content>{key}{": "}{value}</List.Content>
                          <Button basic compact color='blue' onClick={handleConnectBT(device.addresses.BT_MAC)}>Connect BT</Button>
                        </List.Item>
                      ) :
                        <List.Item>
                          <List.Content>{key}{": "}{value}</List.Content>
                        </List.Item>
                    }
                  )}
                </List>
              </Table.Cell>
              <Table.Cell>
                <List>
                  {Object.entries(device.attributes).map(
                    ([key, value]) => (
                      <List.Item>
                        <List.Content>{key}{": "}{value}</List.Content>
                      </List.Item>
                    )
                  )}
                </List>

              </Table.Cell>
              <Table.Cell>
                <List>
                {device.groups.map(group => (
                  <List.Item as='a' key={group}>
                  <List.Content>{group}</List.Content>
                </List.Item>
                ))}
                </List>
              </Table.Cell>
            </Table.Row>
        ))}
        </Table.Body>
      </Table>
      {showDevices ?
        <Button onClick={(handleHideDevices)} primary>
          <Button.Content>
            Hide Devices
          </Button.Content>
        </Button>
        :
        <Button onClick={(handleShowDevices)} primary>
          <Button.Content>
            Show Devices
          </Button.Content>
        </Button>
      }
      <br></br>
      <br></br>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Input name="dname" label="Enter device name" value={values.name} onChange={handleNameChange} inline />
        </Form.Group>
        <Form.Group>
          <Form.Input name="addresskeys" inline label="Add addresses" placeholder="Address keys (comma separated)" value={values.addresskeys} onChange={handleAddressKeyChange} />
          <Form.Input name="addressvalues" placeholder="Address values (comma separated)" value={values.addressvalues} onChange={handleAddressValChange} />
        </Form.Group>
        <Form.Group>
          <Form.Input name="attributekeys" inline label="Add attributes" placeholder="Attribute keys (comma separated)" value={values.attributekeys} onChange={handleAttributeKeyChange} />
          <Form.Input name="attributevalues" placeholder="Attribute values (comma separated)" value={values.attributevalues} onChange={handleAttributeValChange} />
        </Form.Group>
        <Form.Input name="groups" inline label="Add groups" placeholder="Groups (comma separated)" value={values.groups} onChange={handleGroupChange} />
        <Button type="submit" basic >
          <Button.Content>
            <Icon name="mobile alternate" size="big"></Icon>
            <Icon corner name='add' />
          </Button.Content>
        </Button>
      </Form>
      <br></br>

      <div>
        <br></br>
      </div>

      <Header as='h2' dividing>
        Groups
      </Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Group</Table.HeaderCell>
            <Table.HeaderCell>Devices</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {showGroups && groups.map(group => (
          
              <Table.Row key={group}>
                  <Table.Cell style={{width:"35%"}}>
                    {group}
                  </Table.Cell>
                  <Table.Cell>
                    <List>
                      {getDevicesInGroup(group).map(d => (
                        <List.Item>
                          <List.Content>{d}</List.Content>
                        </List.Item>
                      ))}
                    </List>
                  </Table.Cell>
              </Table.Row>  
          
          ))}
        </Table.Body>
      </Table>
      {showGroups ?
        <Button onClick={(handleHideGroups)} primary>
          <Button.Content>
            Hide Groups
          </Button.Content>
        </Button>
        
        :
        <Button onClick={(handleShowGroups)} primary>
          <Button.Content>
            Show Groups
          </Button.Content>
        </Button>
      }
    </Container>
  );
};

export default DeviceList
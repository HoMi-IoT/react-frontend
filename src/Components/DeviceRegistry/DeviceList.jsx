import React, {useState, useEffect} from 'react'
import DeviceData from './DeviceData'
import { Icon, List, Header, Container, Table, Button, Form } from 'semantic-ui-react'

const initial = {
  dname: '',
  addresskeys: '',
  addressvalues: '',
  attributekeys: '',
  attributevalues: '',
  groups: ''
}



const DeviceList = (props) => {
  const devices = DeviceData; //stick in useEffect 
  const [showDevices, setShowDevices] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [values, setValues] =  useState(initial)

  // useEffect(() => {
  //   const getOptions = {
  //     method: 'GET',
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     }
  //   }
  //   fetch('http://localhost:8182/devices', getOptions)
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])

  function combineKV(key, value) {
    var obj = {}
    for (var i = 0; i < key.length; i++) {
      obj[key[i]] = value[i]
    }
    return obj
  }

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
    if (values.dname == '') {
      alert("Must enter a device name!")
      return
    }
    var dname = values.dname
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].name == dname) {
        alert("Device name already exists. Please enter a different name.")
        return 
      }
    }
    var addrk = values.addresskeys.split(',')
    var addrv = values.addressvalues.split(',')
    var address = combineKV(addrk, addrv)
    var attrk = values.attributekeys.split(',')
    var attrv = values.attributevalues.split(',')
    var attribute = combineKV(attrk, attrv)
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
    fetch('https://httpbin.org/post', postOptions)
      .then(response => response.json())
      .then(data => console.log(data))

    alert('New device ' + dname +  ", form submitted.")
    //handle form submit and device adding
    e.preventDefault()
  })

  let groups = [];
  devices.map(device => {
    groups.push(...device.groups)
  }) //offload this to useEffect [] to run once

  const handleShowDevices = () => {
    setShowDevices(true)
    console.log(showDevices)
  }
  const handleHideDevices = () => {
    setShowDevices(false)
  }

  const handleShowGroups = () => {
    setShowGroups(true)
    console.log(showGroups)
  }

  const handleHideGroups = () => {
    setShowGroups(false)
    console.log(showGroups)
  }

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
        {showDevices && devices.map(device => (
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{width:"45%"}}>
                <Header as='h4' image>
                  <Icon name='mobile alternate' />
                    <Header.Content>
                      {device.name}
                    </Header.Content>
                  </Header>
                  <Button basic compact floated={'right'} color='red'>Delete</Button>
                  <Button basic compact floated={'right'} color='blue'>Edit</Button>
              </Table.Cell>
              <Table.Cell>
                <List>
                  {Object.entries(device.addresses).map(
                    ([key, value]) =>  (
                      <List.Item>
                        <List.Content>{key}{": "}{value}</List.Content>
                      </List.Item>
                    )
                  )}
                  </List>
              </Table.Cell>
              <Table.Cell>
                <List>
                {Object.entries(device.attributes).map(
                  ([key, value]) =>  (
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
                  <List.Item as='a'>
                  <List.Content>{group}</List.Content>
                </List.Item>
                ))}
                </List>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
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
          <Form.Input name="dname" label="Enter device name" value={values.name} onChange={handleNameChange} inline/>
        </Form.Group>
        <Form.Group>
          <Form.Input name="addresskeys" inline label="Add addresses" placeholder="Address keys (comma separated)" value={values.addresskeys} onChange={handleAddressKeyChange}/>
          <Form.Input name="addressvalues" placeholder="Address values (comma separated)" value={values.addressvalues} onChange={handleAddressValChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Input name="attributekeys" inline label="Add attributes" placeholder="Attribute keys (comma separated)" value={values.attributekeys} onChange={handleAttributeKeyChange}/>
          <Form.Input name="attributevalues" placeholder="Attribute values (comma separated)" value={values.attributevalues} onChange={handleAttributeValChange}/>
        </Form.Group>
        <Form.Input name="groups" inline label="Add groups" placeholder="Groups (comma separated)" value={values.groups} onChange={handleGroupChange}/>
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
          
              <Table.Row>
                  <Table.Cell>
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
          [<Button basic >
            <Button.Content>
              <Icon name="list" size="big"></Icon>
              <Icon corner name='add' />
            </Button.Content>
          </Button>,
          <Button onClick={(handleHideGroups)} primary>
            <Button.Content>
              Hide Groups
            </Button.Content>
          </Button>
          ]
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
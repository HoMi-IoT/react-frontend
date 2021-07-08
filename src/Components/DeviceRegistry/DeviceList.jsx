import React, {useState} from 'react'
import DeviceData from './DeviceData'
import { Icon, List, Header, Container, Table, Image, Button, Form } from 'semantic-ui-react'

const DeviceList = (props) => {
  let topicId = 3;
  const devices = DeviceData;
  const [showDevices, setShowDevices] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [values, setValues] =  useState({
    dname: '',
    description: '',
    addresskeys: '',
    addressvalues: '',
    attributekeys: '',
    attributevalues: ''
  })

  const handleNameChange = (e => {
    setValues((values) => ({
      ...values,
      dname: e.target.dname
    }));
  });

  const handleDescChange = (e => {
    setValues((values) => ({
      ...values,
      description: e.target.description
    }));
  });

  const handleAddressKeyChange = (e => {
    setValues((values) => ({
      ...values,
      addresskeys: e.target.addresskeys
    }));
  });

  const handleAddressValChange = (e => {
    setValues((values) => ({
      ...values,
      addressvalues: e.target.addressvalues
    }));
  });

  const handleAttributeKeyChange = (e => {
    setValues((values) => ({
      ...values,
      attributekeys: e.target.attributekeys
    }));
  });

  const handleAttributeValChange = (e => {
    setValues((values) => ({
      ...values,
      attributevalues: e.target.attributevalues
    }));
  });

  const handleSubmit = (e => {
    alert('New device form submitted.')
    //handle form submit and device adding
    
    e.preventDefault()
  })

  let groups = [];
  devices.map(device => {
    groups.push(...device.groups)
  })
  console.log("groups:", groups)

  

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
                      <Header.Subheader>{device.description}</Header.Subheader>
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

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Input name="dname" label="Enter device name" value={values.name} onChange={handleNameChange}/>
          <Form.Input name="description" label="Enter description" value={values.description} onChange={handleDescChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Input name="addresskeys" inline label="Add addresses" placeholder="Address keys (comma separated)" value={values.addresskeys} onChange={handleAddressKeyChange}/>
          <Form.Input name="addressvalues" placeholder="Address values (comma separated)" value={values.addressvalues} onChange={handleAddressValChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Input name="attributekeys" inline label="Add attributes" placeholder="Attribute keys (comma separated)" value={values.attributekeys} onChange={handleAttributeKeyChange}/>
          <Form.Input name="attributevalues" placeholder="Attribute values (comma separated)" value={values.attributevalues} onChange={handleAttributeValChange}/>
        </Form.Group>
        <Button type="submit" basic >
            <Button.Content>
              <Icon name="mobile alternate" size="big"></Icon>
              <Icon corner name='add' />
            </Button.Content>
      </Button>
      </Form>
      <br></br>
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
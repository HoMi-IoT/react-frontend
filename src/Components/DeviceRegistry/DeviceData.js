const devices = [
    {
      "name":"device1",
      "addresses":{
        "ipaddr1":"192.168.153.128",
        "MAC":"02:9B:B0:CB:AA:FC"
      },
      "attributes": {
        "num_sensor":"4",
        "weight":"52",
        "battery":"38"
      },
      "groups": ["1", "2"]
    },
    {
      "name":"light1",
      "addresses":{
        "ipaddr1":"10.0.0.18",
        "MAC":"02:9B:99:CB:6Y:FC"
      },
      "attributes": {
        "brightness":"500",
        "color":"blue"
      },
      "groups": ["lights", "living_room"]
    },
    {
      "name":"thermo1",
      "addresses":{
        "ipaddr1":"192.25.0.104",
        "MAC":"CB:HH:FC:02:9B:B0"
      },
      "attributes": {
        "temperature":"68"
      },
      "groups": ["temp", "living_room"]
    }
  ];

  export default devices
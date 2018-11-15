import React, { Component } from 'react';
import {
    Input,
    Button,
    Progress,
    Badge,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';

export default class Modifications extends Component {
    constructor(props) {
      super(props);

      this.state = {
        modification: "Update",
        table: "Bars",
        attributes: [],
        values: [[]],
        condition: "",
        isLoading: false,
      };

      this.nullPadArray = this.nullPadArray.bind(this);
      this.conditionChange = this.conditionChange.bind(this);
      this.attributeChange = this.attributeChange.bind(this);
      this.modifyDatabase = this.modifyDatabase.bind(this);
      this.getAttributes = this.getAttributes.bind(this);
      this.modificationChange = this.modificationChange.bind(this);
      this.tableChange = this.tableChange.bind(this);
    }

    componentDidMount() {
      this.getAttributes(this.state.table);
    }

    modificationChange(e) {
      this.setState({
        modification: e.target.value,
      });
    }

    tableChange(e) {
      this.setState({
        table: e.target.value,
      });

      this.getAttributes(e.target.value);
    }

    conditionChange(e) {
      this.setState({
        condition: e.target.value,
      });
    }

    // Assign 2d array (dictionary) of attributes for record to enter
    attributeChange(e) {

         var values = this.state.values;
         var value = e.target.value;
         var name = e.target.name;
         var index = e.target.attributes.getNamedItem('index').value;

        var tmp = [name, value];

        for (var i in values) {

        if (tmp[0] !== values[i][0] && values.length >= i) {
              values[i][index] = tmp;
              break;
          }
        }

    }


 // renders a view to the web page
  render() {

        var conditionView = <div>
                          <p>Where?:</p>
                          <InputGroup onChange={this.conditionChange}>
                          <Input placeholder="column='value'" />
                          </InputGroup>
                          </div>

        var attributesView =
        this.state.attributes.map((header, i) => {
            return (
             <div key={i}>
             <InputGroup>
             <Input placeholder="value" name={header} index={i} onChange={this.attributeChange}/>
             <InputGroupAddon addonType="prepend">{header}</InputGroupAddon>
             </InputGroup>
             <br/>
             </div>
            );
          })

    if(this.state.isLoading) {
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

      switch (this.state.modification) {
        case "Insert":
            conditionView = <div></div>
            break;
        case "Delete":
          attributesView = <div>
                            {
                            this.state.attributes.map((header, i) => {
                              return (
                                <div key={i}>
                                <Badge>{header}</Badge>
                                </div>
                              );
                            })
                            }
                          <br/>
                          </div>
          break;
          default:
            break;

      }

    return (
      <div style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>
      <div className="row" style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>


       <div className="column">

         <label>Select Modification:</label>
        <Input type="select" name="select" onChange={this.modificationChange}>
         <option>Update</option>
         <option>Delete</option>
         <option>Insert</option>
        </Input>
        <br/>
        <label>Select Table:</label>
        <Input type="select" name="select" onChange={this.tableChange}>
         <option>Bars</option>
         <option>Bartenders</option>
         <option>Bill_Items</option>
         <option>Bills</option>
         <option>Drinkers</option>
         <option>Frequents</option>
         <option>Inventory</option>
         <option>Items</option>
         <option>Likes</option>
         <option>Sells</option>
         <option>Shifts</option>
        </Input>
        <br/>
        {
          attributesView
        }
        {
          conditionView
        }
    <br/>
    <Button outline color="secondary" onClick={this.modifyDatabase}>{this.state.modification}</Button>
    <br/>
    <br/>
    </div>

    </div>
    </div>

       );
     }
  }

  nullPadArray() {
    var attr = this.state.attributes;
    var values = this.state.values[0];

    for (var i = 0; i < attr.length; i++) {
      if (i >= values.length)
      {
        values[i] = [attr[i], "NULL"];
      }
    }

  }

  modifyDatabase() {

    this.nullPadArray();

    /*
    fetch('http://localhost:5000/api/modifyDatabase', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         modification: this.state.modification,
         table: this.state.table,
         values: this.state.values[0],
         condition: this.state.condition,
     }),
     }).then(res => res.json()
   ).then(data => this.setState({isLoading: false}));
   */
  }


  getAttributes(value) {

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/query', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         query: "SELECT * FROM " + value + " LIMIT 1",
     }),
     }).then(res => res.json()
   ).then(data => this.setState({ attributes: Object.keys(data[0]), isLoading: false }));
  }

}

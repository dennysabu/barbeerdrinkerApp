import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Button,
    Progress,
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
        isLoading: false,
      };

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

 // renders a view to the web page
  render() {

        var conditionView = <div>
                          <p>WHERE</p>
                          <InputGroup>
                          <Input placeholder="condition" />
                          </InputGroup>
                          </div>

    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

      if (this.state.modification === "Insert") {
          conditionView = <div></div>
      }

    return (
      <div style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>
      <div className="row" style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>

      <Form>
      <FormGroup>
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

        {this.state.attributes.map((header, i) => {
          return (
            <div key={i}>
           <InputGroup>
           <Input placeholder="value" />
           <InputGroupAddon addonType="prepend">{header}</InputGroupAddon>
           </InputGroup>
           <br/>
           </div>
          );
        })}
        {
          conditionView
        }
    <br/>
    <Button outline color="secondary">Search</Button>
    </div>
    </FormGroup>
    </Form>
    </div>
    </div>

       );
     }
  }
/*
  modifyDatabase() {

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
*/

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

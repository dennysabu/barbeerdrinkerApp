import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Button,
} from 'reactstrap';

export default class Modifications extends Component {


 // renders a view to the web page
  render(){

    return (
      <div style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>
      <div className="row" style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>

      <Form>
      <FormGroup>
       <div className="row">
       <div className="column">
         <label>Select Modification:</label>
        <Input type="select" name="select">
         <option>Update</option>
         <option>Delete</option>
         <option>Insert</option>
        </Input>
        <br/>
        <label>Select Table:</label>
        <Input type="select" name="select">
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
        </div>
      <div className="column" style={{ paddingLeft: '10px' }}>
      <Button outline color="secondary">Search</Button>
      </div>
      </div>
      </FormGroup>
      </Form>
      </div>
      </div>
       );

  }

}

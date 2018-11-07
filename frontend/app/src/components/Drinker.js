import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Label,
    Table,
    Progress,
    Col,
} from 'reactstrap'; // Table pre-built component from reactstrap library

// Drinker Component
export default class Drinker extends Component {
  // default constructor
  constructor(props) {
    super(props);

    // state of component
    this.state = {
      data: [],
      isLoading: true,
      tableHeaders: [],
    };
  }

  // overriden method for when component mounts
  componentDidMount(){
    this.getCustomers();
 }

 // fetch request to express api endpoint
 getCustomers() {
   fetch('/getCustomers',{
       headers: {
           "Content-Type": "application/json", // enables json content only
       }
   })
   .then(res => res.json()) // converts response to json
   .then(data => this.setState({ data: data, tableHeaders:  Object.keys(data[0]), isLoading: false })); // updates the state of Drinker component
 }

 // renders a view to the web page
  render(){

    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

    return (
      <div>
      <br/>
      <Form>
      <Col md={6}>
      <FormGroup>
       <Col md={6}>
        <Label>Select Drinker</Label>
        <Input type="select" name="select">
        {
          this.state.data.map(drinker =>
         <option key={drinker.name}>
         {drinker.name}
         </option>
         )
       }
        </Input>
        </Col>
      </FormGroup>
        </Col>
      </Form>
      </div>

    );
  }

  }

}

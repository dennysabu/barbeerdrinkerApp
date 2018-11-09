import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Label,
    Progress,
    Row,
    Button,
    Table,
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
  render() {

    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

      const table = <Table>
                        <thead style={{fontSize:'22px', textAlign:'center'}}>
                          <tr>
                          {

                            this.state.tableHeaders.map(header =>
                           <th key={header}>
                           {header}
                           </th>
                           )

                         }
                          </tr>
                        </thead>
                        <tbody style={{fontSize:'15px', textAlign:'center'}}>
                        {

                          this.state.data.map((res, x) => {
                            return (
                                 <tr>
                                   {this.state.tableHeaders.map((header, i) => {

                                     return (
                                       <td>{res[header]}</td>
                                     );

                                   })}
                               </tr>
                             );
                           })

                       }
                        </tbody>
                      </Table>


    return (
      <div style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>
      <label>Select Drinker:</label>
      <div className="row" style={{ marginLeft: '30px', marginRight: '30px' }}>
      <br/>

      <Form>
      <FormGroup>
       <div className="row">
       <div className="column">
        <Input type="select" name="select">
        {
         this.state.data.map(drinker =>
         <option key={drinker.name}>
         {drinker.name}
         </option>
         )
        }
        </Input>
        </div>
      <div className="column" style={{ paddingLeft: '10px' }}>
      <Button outline color="secondary">Search</Button>
      </div>
      </div>
      </FormGroup>
      </Form>

      </div>
      <br/>
      {
        table
      }
      </div>


    );
  }

  }

}

import React, { Component } from 'react';
import { Table, Progress } from 'reactstrap'; // Table pre-built component from reactstrap library

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

    // if loading is true
    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

    // if loading is false
    // * style is css styling, I am doing inline styling instead of creating a seperate css file
    //   because I am only using 2 style attributes rather than several
    // * map, maps array of drinkers to the given html elements ex... <tr>, <td>, <tbody>
    // tbody (table body) contains all tr (table row)
    // tr contains td (standard html cell - regular and left-aligned by default)
    // * key - required to map the data to a list or table of array items
    return (
      <Table>
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
       );

     }

  }

}

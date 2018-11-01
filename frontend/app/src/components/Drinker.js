import React, { Component } from 'react';
import { Table } from 'reactstrap'; // Table pre-built component from reactstrap library

// Drinker Component
export default class Drinker extends Component {
  // default constructor
  constructor(props) {
    super(props);

    // state of component
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  // overriden method for when component mounts
  componentDidMount(){
    this.getCustomers();
 }

 // fetch request to express api endpoint
 getCustomers() {
   fetch('/getCustomers',{
       mode: 'no-cors', // disables cors
       headers: {
           "Content-Type": "application/json", // enables json content only
       }
   })
   .then(res => res.json()) // converts response to json
   .then(data => this.setState({ data: data, isLoading: false })); // updates the state of Drinker component
 }

 // renders a view to the web page
  render(){

    // if loading is true
    if(this.state.isLoading){
      return(
        <h1>
        loading...
        </h1>
      )
    }

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
               <th>Drinker</th>
               <th>Address</th>
             </tr>
           </thead>
           <tbody style={{fontSize:'15px', textAlign:'center'}}>
           {
             this.state.data.map(drinker =>
             <tr key={drinker.name}>
             <td>{drinker.name}</td>
             <td>{drinker.address}</td>
             </tr>
             )
           }
           </tbody>
         </Table>
       );

  }

}

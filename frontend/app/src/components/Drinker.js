import React, { Component } from 'react';
import { Table } from 'reactstrap';


export default class Drinker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
    };
  }

  componentDidMount(){

    fetch('/getCustomers',{
        mode: 'no-cors',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(res => res.json())
    .then(data => this.setState({ data: data, isLoading: false }));

 }


  render(){

    if(this.state.isLoading){
      return(
        <h1>
        loading...
        </h1>
      )
    }

    return (
         <Table>
           <thead>
             <tr>
               <th>Drinker</th>
               <th>Address</th>
             </tr>
           </thead>
           <tbody>
           {this.state.data.map(drinker =>
             <tr key={drinker.name}>
             <td>{drinker.name}</td>
             <td>{drinker.address}</td>
             </tr>
           )}
           </tbody>
         </Table>
       );
    
  }

}

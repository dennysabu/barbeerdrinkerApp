import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Progress,
    Button,
    Table,
} from 'reactstrap'; // Table pre-built component from reactstrap library

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
} from "react-vis";


// Drinker Component
export default class Drinker extends Component {
  // default constructor
  constructor(props) {
    super(props);

    // state of component
    this.state = {
      drinker: null,
      drinkers: [],
      transactions: null,
      tableHeaders: [],
      itemGraph: [],
      isLoading: true,
    };

      this.parseGraphData = this.parseGraphData.bind(this);
      this.getItemGraphData = this.getItemGraphData.bind(this);
      this.getTransactions = this.getTransactions.bind(this);
      this.getDrinkers = this.getDrinkers.bind(this);
      this.drinkerSelectionChanged = this.drinkerSelectionChanged.bind(this);
  }

  // overriden method for when component mounts
  componentDidMount() {
    this.getDrinkers();
 }

 drinkerSelectionChanged(e) {
   this.setState({ drinker: e.target.value });
 }


 // renders UI view to the web page
  render() {

    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else if (this.state.transactions === null) {

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
          <Input type="select" name="select" onChange={this.drinkerSelectionChanged}>
          {
           this.state.drinkers.map(drinker =>
           <option key={drinker.name}>
           {drinker.name}
           </option>
           )
          }
          </Input>
          </div>
        <div className="column" style={{ paddingLeft: '15px' }}>
        <Button outline color="secondary" onClick={this.getTransactions}>Search</Button>
        </div>
        </div>
        </FormGroup>
        </Form>

        </div>
        </div>
      );

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

                          this.state.transactions.map((res, x) => {
                            return (
                                 <tr key={x}>
                                   {this.state.tableHeaders.map((header, i) => {

                                     return (
                                       <td key={i}>{res[header]}</td>
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
          <Input type="select" name="select" onChange={this.drinkerSelectionChanged}>
          {
            this.state.drinkers.map(drinker =>
              <option key={drinker.name}>
              {drinker.name}
              </option>
              )
          }
        </Input>
      </div>
          <div className="column" style={{ paddingLeft: '10px' }}>
          <Button outline color="secondary" onClick={this.getTransactions}>Search</Button>
          </div>
      </div>
      </FormGroup>
      </Form>

      </div>
      {
        table
      }
      <br/>
      <br/>
      <div align="center">
      <h1>Top 3 Beers for {this.state.drinker}</h1>
     <XYPlot animation={true} margin={{bottom: 200}} xType="ordinal" width={800} height={500}>
     <VerticalGridLines />
     <HorizontalGridLines />
     <XAxis/>
     <YAxis title="Quantity"/>
     <VerticalBarSeries data={this.state.itemGraph} />
   </XYPlot>
   <br/>
   <br/>
   </div>
   </div>


    );
  }

  }

  /*
   *  API Requests
   */

   // fetch request to express api endpoint
   getDrinkers() {
  	fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getDrinkers',{
  	headers: {
             "Content-Type": "application/json", // enables json content only
         },
     }).then(res => res.json()
   ).then(data => this.setState({ drinkers: data, drinker: data[0].name, tableHeaders:  Object.keys(data[0]), isLoading: false }));
  }

  // fetch request to express api endpoint
  getTransactions() {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTransactionsForDrinker', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "drinker": this.state.drinker
    }),
    }).then(res => res.json()
  ).then(data => {
    this.setState({ transactions: data, tableHeaders: Object.keys(data[0]), drinker: data[0].drinker, isLoading: false });
  });

  this.getItemGraphData();
  }

  // fetch request to express api endpoint
  getItemGraphData() {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getDrinkersTopBeers', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "drinker": this.state.drinker
    }),
    }).then(res => res.json()
  ).then(data => {
      this.parseGraphData(data);
  });
  }

  parseGraphData(data) {
    var itemGraph = [];

    for (var i in data) {
        itemGraph[i] = {x: data[i].item, y: data[i].Quantity};
    }

    this.setState({ itemGraph: itemGraph });
  }

}

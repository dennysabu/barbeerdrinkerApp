import React, { Component, ReactCSSTransitionGroup } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Table,
    Progress,
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
   this.getTransactions(e.target.value);
 }


 // renders UI view to the web page
  render() {

    var inputSelector = <div style={{width: "25%"}}>
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

    var topBeersGraph =   <div align="center">
                          <br/>
                          <br/>
                          <h1>Top 3 Beers for {this.state.drinker}</h1>
                          <br/>
                          <XYPlot animation={true} margin={{bottom: 100}} xType="ordinal" width={800} height={500}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <VerticalBarSeries data={this.state.itemGraph} />
                          <XAxis title="Drinker"/>
                          <YAxis title="Quantity"/>
                          </XYPlot>
                          </div>



    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
     );
   } else if (this.state.transactions === null) {

      return (
        <div align="center">
          <br/>
        <Form>
        <FormGroup>
         <div className="column">
          <label>Select Bar:</label>
        {
          inputSelector
        }
        </div>
        </FormGroup>
        </Form>

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
      <div align="center">
        <br/>
      <Form>
      <FormGroup>
       <div className="column">
        <label>Select Bar:</label>
          {
            inputSelector
          }
      </div>
      </FormGroup>
      </Form>
      {
        topBeersGraph
      }
      {
        table
      }
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
   ).then(data => {
     this.setState({ drinkers: data, drinker: data[0].name, tableHeaders:  Object.keys(data[0]), isLoading: false });
     this.getTransactions(data[0].name);
   });

  }

  // fetch request to express api endpoint
  getTransactions(drinker) {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTransactionsForDrinker', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "drinker": drinker
    }),
    }).then(res => res.json()
  ).then(data => {
    this.setState({ transactions: data, tableHeaders: Object.keys(data[0]), drinker: data[0].drinker });
    this.getItemGraphData(data);
  });


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

    this.setState({ itemGraph: itemGraph, isLoading: false});
  }

}

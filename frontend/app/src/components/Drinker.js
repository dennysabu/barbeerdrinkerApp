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
      date: "2018-02-01",
      week: 0,
    };

      this.february = [
          ['2018-02-01', '2018-02-02', '2018-02-03'],
          ['2018-02-04','2018-02-05','2018-02-06','2018-02-07','2018-02-08','2018-02-09','2018-02-10'],
          ['2018-02-11','2018-02-12','2018-02-13','2018-02-14','2018-02-15','2018-02-16','2018-02-17'],
          ['2018-02-18','2018-02-19','2018-02-20','2018-02-21','2018-02-22','2018-02-23','2018-02-24'],
          ['2018-02-25','2018-02-26','2018-02-27','2018-02-28']
      ]

      this.dateSelectionChanged = this.dateSelectionChanged.bind(this);
      this.weekSelectionChanged = this.weekSelectionChanged.bind(this);
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
     this.getTransactions(e.target.value);
 }

 dateSelectionChanged(e) {

 }

 weekSelectionChanged(e) {

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

        var dateSelector = <div style={{width: "25%"}}>
                           <Input type="select" name="select" onChange={this.dateSelectionChanged}>
                           {

                             this.february.map((res, x) => {
                               return res.map((header, i) => {
                                        return <option key={i}>{header}</option>
                                      })
                                    })
                          }
                           </Input>
                           </div>


      var weekSelector = <div style={{width: "25%"}}>
                          <Input type="select" name="select" onChange={this.weekSelectionChanged}>
                            {
                              this.february.map((week, i) =>
                                <option key={week[i]}>
                                {week[0]}
                                </option>
                              )
                            }
                            </Input>
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
          <label>Select Drinker:</label>
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
        <label>Select Drinker:</label>
          {
            inputSelector
          }
          <br/>
          {
            topBeersGraph
          }
          <h1>The Month of February</h1>
          <br/>
          <label>Select Week:</label>
          {
            weekSelector
          }
          <label>Select Date:</label>
          {
            dateSelector
          }
      </div>
      </FormGroup>
      </Form>
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

    if (data.length !== 0)
    {
    this.setState({
      transactions: data,
      drinker: drinker,
      tableHeaders: Object.keys(data[0]),
      drinker: data[0].drinker
    });
    this.getItemGraphData(data);
  } else {
   alert('Sorry this drinker has no bills');
  }
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

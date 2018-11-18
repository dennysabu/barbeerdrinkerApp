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
  LabelSeries,
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
      beerGraph: [],
      dateGraph: [],
      weekGraph: [],
      isLoading: true,
      date: "2018-02-01",
      week: '2018-02-01',
    };

      this.february = [
          ['2018-02-01', '2018-02-02', '2018-02-03'],
          ['2018-02-04','2018-02-05','2018-02-06','2018-02-07','2018-02-08','2018-02-09','2018-02-10'],
          ['2018-02-11','2018-02-12','2018-02-13','2018-02-14','2018-02-15','2018-02-16','2018-02-17'],
          ['2018-02-18','2018-02-19','2018-02-20','2018-02-21','2018-02-22','2018-02-23','2018-02-24'],
          ['2018-02-25','2018-02-26','2018-02-27','2018-02-28']
      ]

      this.parseWeekGraphData = this.parseWeekGraphData.bind(this);
      this.getWeekGraphData = this.getWeekGraphData.bind(this);
      this.parseDateGraphData = this.parseDateGraphData.bind(this);
      this.getDateGraphData = this.getDateGraphData.bind(this);
      this.dateSelectionChanged = this.dateSelectionChanged.bind(this);
      this.weekSelectionChanged = this.weekSelectionChanged.bind(this);
      this.parseBeerGraphData = this.parseBeerGraphData.bind(this);
      this.getBeerGraphData = this.getBeerGraphData.bind(this);
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
   this.getDateGraphData(e.target.value, this.state.drinker);
 }

 weekSelectionChanged(e) {
   this.getWeekGraphData(e.target.value, this.state.drinker);
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

    var beersGraph =   <div align="center">
                          <br/>
                          <br/>
                          <h1>Top 3 Beers for {this.state.drinker}</h1>
                          <br/>
                          <XYPlot animation={true} margin={{top:25, bottom: 100}} xType="ordinal" width={1000} height={500}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <VerticalBarSeries data={this.state.beerGraph} />
                          <XAxis title="Drinker"/>
                          <YAxis title="Quantity"/>
                          <LabelSeries
                          data={this.state.beerGraph.map(obj => {
                            return { ...obj, label: obj.y.toString() }
                          })}
                          labelAnchorX="middle"
                          labelAnchorY="top"
                          />
                          </XYPlot>
                          </div>

      var dateGraph = <div align="center">
                            <br/>
                            <br/>
                            <h1>{this.state.drinker} Spendings on {this.state.date}</h1>
                            <br/>
                            <XYPlot animation={true} margin={{top: 25, bottom: 100}} xType="ordinal" width={1000} height={500}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <VerticalBarSeries data={this.state.dateGraph} />
                            <XAxis title="Bar"/>
                            <YAxis title="Money Spent (USD)"/>
                            <LabelSeries
                            data={this.state.dateGraph.map(obj => {
                              return { ...obj, label: obj.y.toString() }
                            })}
                            labelAnchorX="middle"
                            labelAnchorY="top"
                            />
                            </XYPlot>
                            </div>

      var weekGraph = <div align="center">
                            <br/>
                            <br/>
                            <h1>{this.state.drinker} Spendings during the week of {this.state.week}</h1>
                            <br/>
                            <XYPlot animation={true} margin={{top: 25, bottom: 100, left: 100, right: 100}} xType="ordinal" width={1000} height={500}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <VerticalBarSeries data={this.state.weekGraph} />
                            <XAxis title="Bar"/>
                            <YAxis title="Money Spent (USD)"/>
                            <LabelSeries
                            data={this.state.weekGraph.map(obj => {
                              return { ...obj, label: obj.y.toString() }
                            })}
                            labelAnchorX="middle"
                            labelAnchorY="top"
                            />
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
            beersGraph
          }
          <h1>The Month of February</h1>
          <br/>
          <label>Select Week:</label>
          {
            weekSelector
          }
          <br/>
          {
            weekGraph
          }
          <label>Select Date:</label>
          {
            dateSelector
          }
          <br/>
          {
            dateGraph
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

     if (data.length !== 0)
     {
       this.setState({ drinkers: data, drinker: data[0].name, tableHeaders:  Object.keys(data[0]), isLoading: false });
       this.getTransactions(data[0].name);
   } else {
    alert('Sorry no drinker information available at this time');
   }
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
      tableHeaders: Object.keys(data[0]),
      drinker: data[0].drinker
    });
    this.getBeerGraphData(data);
  } else {
   alert('Sorry ' + drinker + ' has no bills');
  }
  });

  }

  // fetch request to express api endpoint
  getWeekGraphData(date, drinker) {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getDrinkersSpendingByWeek', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "drinker": drinker,
        "date": date
    }),
    }).then(res => res.json()
  ).then(data => {

    if (data.length !== 0)
    {
      this.setState({
        week: date
      });
    this.parseWeekGraphData(data);
  } else {
   alert('Sorry ' + drinker + ' has no bills for the week of ' + date);
  }
  });

  }

  // fetch request to express api endpoint
  getDateGraphData(date, drinker) {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getDrinkersSpendingByDate', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "drinker": drinker,
        "date": date
    }),
    }).then(res => res.json()
  ).then(data => {

    if (data.length !== 0)
    {
      this.setState({
        date: date
      });
    this.parseDateGraphData(data);
  } else {
   alert('Sorry ' + drinker + ' has no bills for the date ' + date);
  }
  });

  }

  // fetch request to express api endpoint
  getBeerGraphData() {
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
    if (data.length !== 0)
    {
    this.parseBeerGraphData(data);
    this.getDateGraphData(this.state.date, this.state.drinker);
    this.getWeekGraphData(this.state.week, this.state.drinker);
  } else {
   alert('Sorry ' + this.state.drinker + ' does not have a top 3 beers');
  }
  });
  }

  parseBeerGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ beerGraph: graph, isLoading: false});
  }

  parseDateGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ dateGraph: graph, isLoading: false});
  }

  parseWeekGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ weekGraph: graph, isLoading: false});
  }


}

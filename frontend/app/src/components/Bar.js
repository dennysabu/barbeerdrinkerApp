import React, { Component } from 'react';
import {
    Input,
    Progress,
} from 'reactstrap'; // Table pre-built component from reactstrap library

import {
  XYPlot,
  XAxis,
  YAxis,
  LabelSeries,
  VerticalBarSeries,
} from "react-vis";


export default class Bar extends Component {

  constructor(props) {
    super(props);

    // state of component
    this.state = {
      day: "Sunday",
      beer: null,
      beers: [],
      bar: null,
      bars: [],
      itemGraph: [],
      beerGraph: [],
      timeGraph: [],
      salesGraph: [],
      isLoading: true,
    };

    this.getBeers = this.getBeers.bind(this);
    this.beerSelectionChanged = this.beerSelectionChanged.bind(this);
    this.getTimeGraphData = this.getTimeGraphData.bind(this);
    this.parseTimeGraphData = this.parseTimeGraphData.bind(this);
    this.parseBeerGraphData = this.parseBeerGraphData.bind(this);
    this.getBeerGraphData = this.getBeerGraphData.bind(this);
    this.getBars = this.getBars.bind(this);
    this.daySelectionChanged = this.daySelectionChanged.bind(this);
    this.barSelectionChanged = this.barSelectionChanged.bind(this);
    this.getItemGraphData = this.getItemGraphData.bind(this);
    this.parseItemGraphData = this.parseItemGraphData.bind(this);
  }

  // overriden method for when component mounts
  componentDidMount() {
    this.getBars();
    this.getBeers();
 }

 barSelectionChanged(e) {
   this.setState({ bar: e.target.value });
   this.getItemGraphData(e.target.value);
 }

 daySelectionChanged(e) {
   this.setState({ day: e.target.value });
   this.getBeerGraphData(this.state.bar, e.target.value);
   this.getSalesGraphData(this.state.beer, e.target.value);
 }

 beerSelectionChanged(e) {
   this.setState({ beer: e.target.value });
   this.getSalesGraphData(e.target.value, this.state.day);
 }

 // renders a view to the web page
  render(){

    if(this.state.isLoading) {
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {


      var barsInput = <div style={{width: "25%"}}>
                      <Input className="inputselector" type="select" name="select" onChange={this.barSelectionChanged}>
                      {
                        this.state.bars.map(bar =>
                          <option key={bar.name}>
                          {bar.name}
                          </option>
                        )
                      }
                      </Input>
                      </div>

      var dayInput = <div style={{width: "25%"}}>
                      <Input className="inputselector" type="select" name="select" onChange={this.daySelectionChanged}>
                          <option>Sunday</option>
                          <option>Monday</option>
                          <option>Tuesday</option>
                          <option>Wednesday</option>
                          <option>Thursday</option>
                          <option>Friday</option>
                          <option>Saturday</option>
                      </Input>
                      </div>

    var beerInput = <div style={{width: "25%"}}>
                    <Input className="inputselector" type="select" name="select" onChange={this.beerSelectionChanged}>
                    {
                      this.state.beers.map(beer =>
                        <option key={beer.name}>
                        {beer.name}
                        </option>
                      )
                    }
                    </Input>
                    </div>


      var topSpenders =   <div align="center">
                          <XYPlot animation={true} margin={{top: 25, bottom: 100}} xType="ordinal" xDistance={1000} width={1000} height={500}>
                          <VerticalBarSeries data={this.state.itemGraph} />
                          <XAxis title="Drinker"/>
                          <YAxis title="Amount Spent (USD)"/>
                          <LabelSeries
                          data={this.state.itemGraph.map(obj => {
                            return { ...obj, label: obj.y.toString() }
                          })}
                          labelAnchorX="middle"
                          labelAnchorY="top"
                          />
                          </XYPlot>
                          </div>

    var topBeers =      <div align="center">
                        <XYPlot animation={true} margin={{top: 25, bottom: 100}} xType="ordinal" xDistance={1000} width={1000} height={500}>
                        <VerticalBarSeries data={this.state.beerGraph} />
                        <XAxis title="Beer"/>
                        <YAxis title="Amount Sold"/>
                        <LabelSeries
                        data={this.state.beerGraph.map(obj => {
                          return { ...obj, label: obj.y.toString() }
                        })}
                        labelAnchorX="middle"
                        labelAnchorY="top"
                        />
                        </XYPlot>
                        </div>

    var timeDist =      <div align="center">
                        <XYPlot animation={true} margin={{top: 25, bottom: 100}} xType="ordinal" xDistance={1000} width={1250} height={500}>
                        <VerticalBarSeries data={this.state.timeGraph} />
                        <XAxis title="Date Time (24-Hr)"/>
                        <YAxis title="Transactions"/>
                        <LabelSeries
                        data={this.state.timeGraph.map(obj => {
                          return { ...obj, label: obj.y.toString() }
                        })}
                        labelAnchorX="middle"
                        labelAnchorY="top"
                        />
                        </XYPlot>
                        </div>

      var salesGraph =    <div align="center">
                          <XYPlot animation={true} margin={{left: 100, right: 100, top: 25, bottom: 100}} xType="ordinal" xDistance={500} width={1000} height={500}>
                          <VerticalBarSeries data={this.state.salesGraph} />
                          <XAxis title="Bar"/>
                          <YAxis title={this.state.beer + " Sold"}/>
                          <LabelSeries
                          data={this.state.salesGraph.map(obj => {
                            return { ...obj, label: obj.y.toString() }
                          })}
                          labelAnchorX="middle"
                          labelAnchorY="top"
                          />
                          </XYPlot>
                          </div>



    return (
        <div align="center">
          <br/>
            <h1>Analytics</h1>

        <div className="column">
            <label>Select Bar & Day:</label>
        <div className="row" style={{width: '50%', display: "flex", justifyContent: "space-around"}}>
              {
                barsInput
              }
              {
                dayInput
              }
        </div>
        </div>

        <div style={{ marginLeft: '30px', marginRight: '30px' }}>
          <br/>
          <br/>
          <h1>Top Spenders at {this.state.bar}</h1>
          <br/>
          {
            topSpenders
          }
          <h1>Top Beers at {this.state.bar} on a {this.state.day}</h1>
          {
            topBeers
          }
          <h1>Time Distribution of Sales on a {this.state.day} for {this.state.bar}</h1>
          {
            timeDist
          }
          <h1>Top Bars by Sales of {this.state.beer} on a {this.state.day}</h1>
          <br/>
          <p>Select Beer:</p>
          {
            beerInput
          }
          <br/>
          <br/>
          {
            salesGraph
          }
        </div>

        </div>
       );

     }

  }

  getBeers() {
    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBeers', {
    method: "GET",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
     }).then(res => res.json()
    ).then(data => {
       this.setState({ beers: data, beer: data[0].name });
       this.getSalesGraphData(data[0].name, this.state.day);
   });
  }

  getBars() {

   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBars', {
   method: "GET",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
    }).then(res => res.json()
  ).then(data => {
      this.setState({bars: data, bar: data[0].name});
      this.getItemGraphData(data[0].name, this.state.day);
      this.getBeerGraphData(data[0].name, this.state.day);
      this.getTimeGraphData(data[0].name, this.state.day);
  });
}
  // fetch request to express api endpoint
  getItemGraphData(bar, day) {

   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTop10Spenders', {
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "bar": bar
    }),
    }).then(res => res.json()
  ).then(data => {
      this.parseItemGraphData(data);
      this.getBeerGraphData(this.state.bar, this.state.day);
      this.getTimeGraphData(this.state.bar, this.state.day);
  });

  }

  getBeerGraphData(bar, day) {

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTopBeersForBarAndDay', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         "bar": bar,
         "day": day,
     }),
     }).then(res => res.json()
   ).then(data => {
       this.parseBeerGraphData(data);
       this.getTimeGraphData(this.state.bar, this.state.day);
   });

  }

  getTimeGraphData(bar, day) {

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTimeDistForBar', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         "bar": bar,
         "day": day,
     }),
     }).then(res => res.json()
   ).then(data => {
       this.parseTimeGraphData(data);
   });

  }

getSalesGraphData(beer, day) {

  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBarBySales', {
  method: "POST",
  headers: {
           "Content-Type": "application/json", // enables json content only
       },
  body: JSON.stringify({
       "beer": beer,
       "day": day,
   }),
   }).then(res => res.json()
 ).then(data => {
     this.parseSalesGraphData(data);
 });

}


  parseItemGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ itemGraph: graph, isLoading: false});

  }

  parseBeerGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ beerGraph: graph, isLoading: false});

  }

  parseTimeGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ timeGraph: graph, isLoading: false});

  }

  parseSalesGraphData(data) {

    var graph = [];

    for (var i in data) {
        let vals = Object.values(data[i]);
        graph[i] = {x: vals[0], y: vals[1]};
    }
    this.setState({ salesGraph: graph, isLoading: false});

  }

}

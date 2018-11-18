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

export default class Manufacturer extends Component {

  constructor(props) {
    super(props);

    // state of component
    this.state = {
      manf: null,
      manfs: [],
      week: '2018-02-01',
      weeks: this.february,
      salesGraph: [],
      likesGraph: [],
      weeksGraph: [],
      isLoading: true,
    };

    this.february = [
          '2018-02-01',
          '2018-02-04',
          '2018-02-11',
          '2018-02-18',
          '2018-02-25'
    ]

    this.getManfs = this.getManfs.bind(this);
    this.manfSelectionChanged = this.manfSelectionChanged.bind(this);
    this.weekSelectionChanged = this.weekSelectionChanged.bind(this);
    this.getSalesGraphData = this.getSalesGraphData.bind(this);
    this.parseSalesGraphData = this.parseSalesGraphData.bind(this);
    this.getWeeksGraphData = this.getWeeksGraphData.bind(this);
    this.parseWeeksGraphData = this.parseWeeksGraphData.bind(this);
    this.getLikesGraphData = this.getLikesGraphData.bind(this);
    this.parseLikesGraphData = this.parseLikesGraphData.bind(this);

  }

  componentDidMount() {
    this.getManfs();
  }

  weekSelectionChanged(e) {
    this.setState({ week: e.target.value });
    this.getWeeksGraphData(this.state.manf, e.target.value);
  }

  manfSelectionChanged(e) {
    this.setState({ manf: e.target.value });
    this.getWeeksGraphData(e.target.value, this.state.week);
    this.getSalesGraphData(e.target.value);
    this.getLikesGraphData(e.target.value);

  }

 // renders a view to the web page
  render() {

    var weekSelector = <div style={{width: "25%"}}>
                        <Input type="select" name="select" onChange={this.weekSelectionChanged}>
                          {
                            this.february.map(i =>
                              <option key={i}>
                              {i}
                              </option>
                            )
                          }
                          </Input>
                          </div>

    var manfSelector = <div style={{width: "25%"}}>
                        <Input type="select" name="select" onChange={this.manfSelectionChanged}>
                          {
                            this.state.manfs.map(man =>
                              <option key={man}>
                              {man.manf}
                              </option>
                            )
                          }
                          </Input>
                          </div>

    var salesGraph =   <div align="center">
                       <br/>
                       <br/>
                        <h1>Cities where the Sales for {this.state.manf} are the highest</h1>
                        <br/>
                        <XYPlot animation={true} margin={{top:25, bottom: 100, left: 100, right: 100}} xType="ordinal" width={1000} height={500}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <VerticalBarSeries data={this.state.salesGraph} />
                        <XAxis title="Cities"/>
                        <YAxis title="Sales (USD)"/>
                        <LabelSeries
                          data={this.state.salesGraph.map(obj => {
                            return { ...obj, label: obj.y.toString() }
                          })}
                          labelAnchorX="middle"
                          labelAnchorY="top"
                          />
                        </XYPlot>
                        </div>

    var likesGraph = <div align="center">
                       <br/>
                       <br/>
                        <h1>Cities where beers are liked the most for {this.state.manf}</h1>
                        <br/>
                        <XYPlot animation={true} margin={{top:25, bottom: 100, left: 100, right: 100}} xType="ordinal" width={1000} height={500}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <VerticalBarSeries data={this.state.likesGraph} />
                        <XAxis title="Cities"/>
                        <YAxis title="Likes"/>
                        <LabelSeries
                          data={this.state.likesGraph.map(obj => {
                            return { ...obj, label: obj.y.toString() }
                          })}
                          labelAnchorX="middle"
                          labelAnchorY="top"
                          />
                        </XYPlot>
                        </div>

      var weeksGraph = <div align="center">
                         <br/>
                         <br/>
                          <h1>Cities where sales are the highest for {this.state.manf} during the week of {this.state.week}</h1>
                          <br/>
                          <XYPlot animation={true} margin={{top:25, bottom: 100, left: 100, right: 100}} xType="ordinal" width={1000} height={500}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <VerticalBarSeries data={this.state.weeksGraph} />
                          <XAxis title="Cities"/>
                          <YAxis title="Sales (USD)"/>
                          <LabelSeries
                            data={this.state.weeksGraph.map(obj => {
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
              <label>Select Manufacturer:</label>
              {
                manfSelector
              }
              {
                salesGraph
              }
              {
                likesGraph
              }
              <label>Select Week:</label>
              {
                weekSelector
              }
              {
                weeksGraph
              }
              </div>
       );

  }


  getManfs() {
   fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getManfs', {
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
    }).then(res => res.json()
  ).then(data => {

    if (data.length !== 0)
    {
      this.setState({ manf: data[0].manf, manfs: data });
      this.getSalesGraphData(data[0].manf);
      this.getLikesGraphData(data[0].manf);
      this.getWeeksGraphData(data[0].manf, this.state.week);
  } else {
   alert('Sorry no manufacturer information available at this time');
  }
  });
 }

 getSalesGraphData(manf) {
  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getManfSales',{
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         "manf": manf
     }),
   }).then(res => res.json()
 ).then(data => {

   if (data.length !== 0)
   {
     this.parseSalesGraphData(data);
 } else {
  alert('Sorry sales information available at this time');
 }
 });
}

getLikesGraphData(manf) {
 fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getManfLikes',{
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "manf": manf
    }),
  }).then(res => res.json()
).then(data => {

  if (data.length !== 0)
  {
   this.parseLikesGraphData(data);
} else {
 alert('Sorry no likes information available at this time');
}
});
}

getWeeksGraphData(manf, date) {
 fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getManfSalesByWeek',{
   method: "POST",
   headers: {
            "Content-Type": "application/json", // enables json content only
        },
   body: JSON.stringify({
        "manf": manf,
        "date": date
    }),
  }).then(res => res.json()
).then(data => {

  if (data.length !== 0)
  {
   this.parseWeeksGraphData(data);
} else {
 alert('Sorry no weeks information available at this time');
}
});
}

parseSalesGraphData(data) {

  var graph = [];

  for (var i in data) {
      let vals = Object.values(data[i]);
      graph[i] = {x: vals[0], y: vals[1]};
  }
  this.setState({ salesGraph: graph, isLoading: false});
}

parseLikesGraphData(data) {

  var graph = [];

  for (var i in data) {
      let vals = Object.values(data[i]);
      graph[i] = {x: vals[0], y: vals[1]};
  }
  this.setState({ likesGraph: graph, isLoading: false});
}

parseWeeksGraphData(data) {

  var graph = [];

  for (var i in data) {
      let vals = Object.values(data[i]);
      graph[i] = {x: vals[0], y: vals[1]};
  }
  this.setState({ weeksGraph: graph, isLoading: false});
}

}

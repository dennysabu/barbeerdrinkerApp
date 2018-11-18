import React, { Component } from 'react';
import {
    Input,
    Progress,
    Table,
    Alert,
} from 'reactstrap'; // Table pre-built component from reactstrap library
import './Beer.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
} from "react-vis";

class Beer extends Component {



  constructor(props) {
    super(props);

  this.state = {
    Beer: null,
    Manufacturer: null,
    data: [],
    BeerData: [],
    tableHeaders: [],
    beerTableHeader: ["drinker", "bought"],
    barTableHeader: ["bar", "sold"],

    isLoading: true,
    graphItems: [],
    graphLoading: true,
    graphBarItems: [],
    topBarData: [],

    //Test
    timeTableHeader: ["time", "sold"],
    timeBarData: [],
    timeBarDataGraph: [],





  };

    this.getBeers = this.getBeers.bind(this);
    this.getTopConsumers = this.getTopConsumers.bind(this)
    this.beerSelectionChanged = this.beerSelectionChanged.bind(this);
    this.populateGraph = this.populateGraph.bind(this);
    this.getTopBars = this.getTopBars.bind(this);
    this.populateBarGraph = this.populateBarGraph.bind(this);

    //Test BeerData
    this.getTimeSold = this.getTimeSold.bind(this);
    this.populateTimeBarGraph = this.populateTimeBarGraph.bind(this);

  }






componentDidMount() {

  this.getBeers();

}


componentDidUpdate(){

}


  render(){

    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

      var alrt;

      if(this.state.BeerData.length === 0){
        alrt = <Alert color = "danger" >This beer hasn't sold anything! Try another beer.</Alert>
      }
      else {

      }

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
                                 <tr className ="tlbrow">
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

        const insights = <Table>
          <thead style={{fontSize:'22px', textAlign:'center', textTransform: 'capitalize'} }>
            <tr>
              {
                this.state.beerTableHeader.map(header =>
                  <th key={header}>
                    {header}
                  </th>
                )
              }

            </tr>
          </thead>
          <tbody style={{fontSize:'15px', textAlign:'center'}}>
            {
              this.state.BeerData.map((res, x) => {

                return (
                  <tr className="tlbrow">
                  {this.state.beerTableHeader.map((header, i) => {

                    return (
                      <td>{ res[header] }</td>
                    );

                  })}
                  </tr>
                );
              })
            }
          </tbody>
        </Table>


        const topsellingbars = <Table>
          <thead style={{fontSize:'22px', textAlign:'center', textTransform: 'capitalize'} }>
            <tr>
              {
                this.state.barTableHeader.map(header =>
                  <th key={header}>
                    {header}
                  </th>
                )
              }

            </tr>
          </thead>
          <tbody style={{fontSize:'15px', textAlign:'center'}}>
            {
              this.state.topBarData.map((res, x) => {

                return (
                  <tr className="tlbrow">
                  {this.state.barTableHeader.map((header, i) => {

                    return (
                      <td>{ res[header] }</td>
                    );

                  })}
                  </tr>
                );
              })
            }
          </tbody>
        </Table>



      const x =    <XYPlot animation={true} margin={{top:25, bottom: 100, left: 100, right: 100}} xType="ordinal"  width={1000} height={500} margin={{bottom: 100, left: 100} } >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis tickLabelAngle={335}/>
                     <YAxis title="Quantity"/>
                    <VerticalBarSeries data={this.state.graphItems} color="skyblue"/>
                  </XYPlot>

      const y =    <XYPlot animation={true} margin={{left: 100 ,bottom: 100}} xType="ordinal" width={1000} height={500} margin={{bottom: 150, left: 100} }>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis tickLabelAngle={335}/>
                    <YAxis title="Quantity"/>
                    <VerticalBarSeries data={this.state.graphBarItems} color="skyblue"/>
                  </XYPlot>


      const z =    <XYPlot animation={true} margin={{left: 100 ,bottom: 100}} xType="ordinal" width={1000} height={500} margin={{bottom: 100, left: 100} }>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis tickLabelAngle={335}/>
                     <YAxis title="Quantity"/>
                    <VerticalBarSeries data={this.state.timeBarDataGraph} color="skyblue"/>
                  </XYPlot>

//Actual HTML
        return (
          <div className="glb">

            <div className="firstTable">

            <div className="tlb_sel">

            </div>


                <div className="tlb">
                  {table}
                </div>

            </div>

            <div className="beerinsight">
                    <div className ="insightHeader">
                      <h1> Beer Insight </h1>
                      <h2> Beer:
                      <Input type="select" name="select" onChange={this.beerSelectionChanged}>
                      {
                        this.state.data.map(Beer =>
                          <option key={Beer.item}>
                            {Beer.Beer}
                          </option>
                        )
                      }
                  </Input> </h2>
                      <h2> Manufacturer: {this.state.Manufacturer} </h2>
                      <hr/>
                    </div>

              <div className="actualInsights">
                    <div className="TopBuyers">
                            {alrt}
                            <h1 className="beerinsightgraphtitle"> Top 10 Buyers of {this.state.Beer}</h1>
                            {x}
                            <hr/>
                            {insights}
                    </div>
                    <hr/>
                    <div className="TopSellers">
                            <h1 className="beerinsightgraphtitle"> Top 10 Selling Bars for {this.state.Beer}</h1>
                            {y}
                            <hr/>
                            {topsellingbars}
                    </div>
                    <hr/>
                    <div className="HourSellers">
                            <h1 className="beerinsightgraphtitle"> Time Distribution for {this.state.Beer}</h1>
                            {z}
                            <hr/>

                    </div>


              </div>


              </div>



          </div >


        )


    }



}//ends return


populateTimeBarGraph(data){
  let g = [];

  if(data.length === 0)
      {
      g[0] = {x: "None", y: 0};
      this.setState({timeBarDataGraph: g});
      //this.setState({graphItems: {x: "None", y: 0} });
      return;
      }
  else{
    for(var i in data){
      g[i] = {x: data[i].time, y: data[i].sold}
      }
    }
    this.setState({timeBarDataGraph:g});
    this.forceUpdate();

    return;



}



getTimeSold(value){
  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/beerTdtime',{
    method: "post",
    headers: {
        "Content-Type":"application/json",
    },
    body: JSON.stringify({
      beer: value
    })
  }).then(res => res.json(),
  ).then(data=> {
  this.setState({topBarData: data});
  //console.log(data);
  this.populateTimeBarGraph(data);
  } );
}


populateBarGraph(data)
{
  let g = [];

  if(data.length === 0)
      {
      g[0] = {x: "None", y: 0};
      this.setState({graphBarItems: g});
      //this.setState({graphItems: {x: "None", y: 0} });
      return;
      }
    else{
      for(var i in data){
        g[i] = {x: data[i].bar, y: data[i].sold}
        }
      }
      this.setState({graphBarItems:g});
      this.forceUpdate();

      return;
}


getTopBars(value){


  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBarsForBeer',{
    method: "post",
    headers: {
        "Content-Type":"application/json",
    },
    body: JSON.stringify({
      beer: value
    })
  }).then(res => res.json(),
  ).then(data=> {
  this.setState({topBarData: data});
  this.populateBarGraph(data);
  } );

}






populateGraph(data){

  let g = [];

  if(data.length === 0)
      {
      g[0] = {x: "None", y: 0};
      this.setState({graphItems: g});
      //this.setState({graphItems: {x: "None", y: 0} });
      return;
      }
    else{
      for(var i in data){
        g[i] = {x: data[i].drinker, y: data[i].bought}
        }
      }
      this.setState({graphItems:g});
      this.forceUpdate();

      return;


}

getTopConsumers(value){

  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getTopBeerConsumers',{
    method: "post",
    headers: {
        "Content-Type":"application/json",
    },
    body: JSON.stringify({
      beer: value
    })
  }).then(res => res.json()
).then(data=> {
  this.setState({BeerData: data,  BeerIsLoading: false});
  this.populateGraph(data);
  this.getTopBars(value);
  this.getTimeSold(value);
} );

  this.forceUpdate();
}


getBeers(){

  fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/query',{
    method: "post",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify({
      "query": "SELECT DISTINCT name as Beer, manf as Manufacturer FROM Items WHERE type='beer'",
    }),
      }).then(res => res.json()
    ).then(data =>
      {

      this.setState({ data: data, tableHeaders:  Object.keys(data[0]), isLoading: false, Beer: data[0].Beer, Manufacturer: data[0].Manufacturer})
        this.getTopConsumers(data[0].Beer);



    });
}



beerSelectionChanged(e){
  //console.log(e.target.value);
  this.setState({Beer: e.target.value});
  for (var i in this.state.data){

    if(e.target.value === this.state.data[i].Beer){
      this.setState({Manufacturer: this.state.data[i].Manufacturer});
    }
  }
  this.getTopConsumers(e.target.value);

}


}

export default Beer;

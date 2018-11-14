import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Progress,
    Button,
    Table,
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
    isLoading: true,
    graphItems: [],
    graphLoading: true,
    graphBarItems: [],
    topBarData: [],
  };

    this.getBeers = this.getBeers.bind(this);
    this.getTopConsumers = this.getTopConsumers.bind(this)
    this.beerSelectionChanged = this.beerSelectionChanged.bind(this);
    this.populateGraph = this.populateGraph.bind(this);
    this.getTopBars = this.getTopBars.bind(this);
    this.populateBarGraph = this.populateBarGraph.bind(this);


  }






componentDidMount() {

  this.getBeers();
  this.getTopConsumers(this.state.Beer);
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



      let barTableData = [];

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

      const x =    <XYPlot animation={true} margin={{bottom: 50}} xType="ordinal" width={1000} height={500}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis/>
                    <YAxis title="Quantity" />
                    <VerticalBarSeries data={this.state.graphItems} color="skyblue"/>
                  </XYPlot>

      const y =    <XYPlot animation={true} margin={{bottom: 50}} xType="ordinal" width={1000} height={500}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis/>
                    <YAxis title="Quantity"/>
                    <VerticalBarSeries data={this.state.graphBarItems} color="skyblue"/>
                  </XYPlot>

//Actual HTML
        return (
          <div className="glb">

            <div className="firstTable">
                <div className="tlb_sel">
                    <p> Select Beer </p>
                    <Input type="select" name="select" onChange={this.beerSelectionChanged} >
                    {
                      this.state.data.map(Beer =>
                        <option key={Beer.item}>
                          {Beer.Beer}
                        </option>
                      )
                    }
                </Input>

                </div>


                <div className="tlb">

                  {table}
                </div>
            </div>

            <div className="beerinsight">
                    <div className ="insightHeader">
                      <h1> Beer Insight </h1>
                      <h2> Beer: {this.state.Beer} </h2>
                      <h2> Manufacturer: {this.state.Manufacturer} </h2>
                      <hr/>
                    </div>

              <div className="actualInsights">
                    <div className="TopBuyers">
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



                    </div>


              </div>


              </div>



          </div >


        )


    }



}//ends return


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
  }).then(res => res.json(),
).then(data=> {
  this.setState({BeerData: data,  BeerIsLoading: false});
  this.populateGraph(data);
  this.getTopBars(value);
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
          ).then(data => this.setState({ data: data, tableHeaders:  Object.keys(data[0]), isLoading: false, Beer: data[0].Beer, Manufacturer: data[0].Manufacturer}));
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





/*
<div>
  <h2>Beer</h2>
<p>Hey Steve, don't yell at me</p>
<ul>
<li> List of all beers</li>
<p> SELECT DISTINCT name from Items where type='beer' </p>
<li> Beers sold by certain bar </li>
<p> drop down of all bars, then get SELECT DISTINCT item from Sells, Items where Bar = '207' and Items.name = Sells.item and Items.type = 'beer' </p>
<li> Number of specific beer sold </li>
</ul>
</div>
*/


/*
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






return(
  <div>
    <p> Steve has a big dick </p>
    <Button onClick={this.getBeers}>STEVE</Button>
    <div>
      {table}
    </div>
  </div>
);
}





*/

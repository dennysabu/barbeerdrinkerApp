import React, { Component } from 'react';
import './Bartender.css'
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

//Steveo
export default class Bartender extends Component {

  constructor(props){
    super(props);

  this.state = {
    //Bars
    Bars: [],   //Stores Bars
    BarsIsLoading: true, //Bars is isLoading
    CurrentBarSelected: [],

    //Bartenders
    Bartenders: [], //From Selected Bar
    CurrentBartenderSelected: [],

    //Information To Be Displayed
    ItemsSoldByBartender: [],
    ItemsHeader: ["item", "sold"],
    ItemsGraph: [],
    InformationCanLoad: false,

  }


  //Bind Functions
  this.getBars = this.getBars.bind(this);
  this.getInfo = this.getInfo.bind(this);
  this.getCountsSold = this.getCountsSold.bind(this);
  this.getBartenders = this.getBartenders.bind(this);
  this.barSelectionChanged = this.barSelectionChanged.bind(this);
  this.bartenderSelectionChanged = this.bartenderSelectionChanged.bind(this);
  this.populateCountSoldByGraph = this.populateCountSoldByGraph.bind(this);

}

  componentDidMount() {
    this.getBars();
  }



 // renders a view to the web page
  render(){

    //Table that displays count of items sold by bartender
    const countsoldby = <Table width={100}>
                      <thead style={{fontSize:'22px', textAlign:'center'}}>
                        <tr>
                        {
                          this.state.ItemsHeader.map(header =>
                         <th key={header}>
                         {header}
                         </th>
                         )
                       }
                        </tr>
                      </thead>
                      <tbody style={{fontSize:'15px', textAlign:'center'}}>
                      {
                        console.log("Items Graph: " + this.state.ItemsGraph),
                        this.state.ItemsSoldByBartender.map((res, x) => {
                          return (
                               <tr className ="tlbrow">
                                 {this.state.ItemsHeader.map((header, i) => {

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



    const itemsoldbar =    <XYPlot animation={true} xType="ordinal" width={900} height={500} margin={{bottom: 100, left: 30} } >
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis />
                   <YAxis title="Quantity"/>
                  <VerticalBarSeries data={this.state.ItemsGraph} color="skyblue"/>
                </XYPlot>



    //Drop Down to select a bar:
    const selectBar =
                                <Input type ="select" onChange={this.barSelectionChanged}>
                                 {

                                   this.state.Bars.map(Bar =>
                                     <option key = {Bar.item}>
                                       {Bar.name}
                                     </option>
                                   )
                                 }
                                </Input>




    const selectBartender =
                                <Input type ="select" onChange= {this.bartenderSelectionChanged}>
                                 {

                                   this.state.Bartenders.map(Bartenders =>
                                     <option key = {Bartenders.bartender}>
                                       {Bartenders.bartender}
                                     </option>
                                   )
                                 }
                                </Input>


    var ld;

    if(!this.state.InformationCanLoad){
      ld = <Progress multi>
              <Progress bar animated color="success" value="0"/>
            </Progress>
    }
    else {

      ld = <Progress multi>
              <Progress bar color="success" value="100"/>
            </Progress>
    }



    if(this.state.BarsIsLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    }
    else {

    return (
        <div className = "btd-glb">

              <div className = "selection">
                  <h2> Select a Bar: </h2>
                  {selectBar}
                  <h2> Select a Bartender: </h2>
                  {selectBartender}
                  {ld}
                  <hr/>


                  <Button size="lg" onClick={this.getCountsSold}>Get Information</Button>
              </div>

              {countsoldby}
              {itemsoldbar}


        </div>

       );

     }

  }
  //Ends render

  //Gets all bars
  getBars(){

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBars',{
      method: "get",
      headers: {
        "Content-Type":"application/json",
      },

        }).then(res => res.json()
      ).then(data => {
        this.setState( { Bars: data, BarsIsLoading:false}) ;
        //console.log(data);
        this.getBartenders(data[0].name);
      });


  }


  //Listens for Bar change
  barSelectionChanged(e){
    this.setState({CurrentBarSelected: e.target.value, InformationCanLoad:false});
    this.getBartenders(e.target.value);
  }

  bartenderSelectionChanged(e){
    this.setState({CurrentBartenderSelected: e.target.value, InformationCanLoad:false});
  }


  //Gets Bartenders from CurrentBarSelected
  getBartenders(value){

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBartendersByBar',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        "bar": value,
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { Bartenders: data, CurrentBartenderSelected:data[0].bartender, InformationCanLoad: false}) ;
      console.log(data);
    });

    //this.setState({InformationCanLoad: true});

  }

  getCountsSold(){
    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/query',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        /*
        "bar": this.CurrentBarSelected[0].bar,
        "bartender": this.CurrentBartenderSelected[0].bartender,
        */
        "query": "SELECT bi.item, COUNT(bi.item) as sold FROM Bills b, Bill_Items bi WHERE b.id = bi.billid AND b.bartender = 'Aline' AND b.bar = 'Avenu Lounge'  GROUP BY (bi.item)",
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { ItemsSoldByBartender: data, InformationCanLoad: false}) ;
      console.log(data);
      this.populateCountSoldByGraph(data);
    });
  }

  populateCountSoldByGraph(data){
    let g = [];

    if(data.length === 0)
        {
        g[0] = {x: "None", y: 0};
        this.setState({ItemsGraph: g});
        //this.setState({graphItems: {x: "None", y: 0} });
        return;
        }
      else{
        for(var i in data){
            g[i] = {x: data[i].item, y: data[i].sold}
          }
        }
        this.setState({ItemsGraph:g, InformationCanLoad:true });
        //console.log(g);
        this.forceUpdate();
        return;
  }




  //Get Info
  getInfo(){
    this.setState({InformationCanLoad: true})
  }



}//Ends component i think

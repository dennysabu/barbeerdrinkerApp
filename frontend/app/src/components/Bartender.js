import React, { Component } from 'react';
import './Bartender.css'
import {
    Form,
    FormGroup,
    Input,
    Progress,
    Button,
    Table,
    Alert,
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
    first: true,


    //Analytics
    BarsForAnalytics: [],
    SelectedBar: [],
    Shifts: [],
    SelectedShifts: null,

  }


  //Bind Functions
  this.getBars = this.getBars.bind(this);
  this.getInfo = this.getInfo.bind(this);
  this.getCountsSold = this.getCountsSold.bind(this);
  this.getBartenders = this.getBartenders.bind(this);
  this.barSelectionChanged = this.barSelectionChanged.bind(this);
  this.bartenderSelectionChanged = this.bartenderSelectionChanged.bind(this);
  this.populateCountSoldByGraph = this.populateCountSoldByGraph.bind(this);
  this.analyticsBarSelectionChanged = this.analyticsBarSelectionChanged.bind(this);
  this.getShiftDays = this.getShiftDays.bind(this);

}

  componentDidMount() {
    this.getBars();
  }



 // renders a view to the web page
  render(){

    var alrt;

    if(this.state.ItemsSoldByBartender.length === 0 && !this.state.first){
      alrt = <Alert color = "danger" >This bartender hasn't sold anything! Try another bartender.</Alert>
    }
    else {

    }


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



    const itemsoldbar =    <XYPlot animation={true} xType="ordinal" width={1000} height={500} className={"test"} margin={{bottom: 100, left: 100} } >
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis tickLabelAngle={335}/>
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




      //Drop Down to select a bar:
      const selectBarForAnalytics =
                                <Input type ="select" onChange={this.analyticsBarSelectionChanged}>
                                   {
                                     this.state.BarsForAnalytics.map(Bar =>
                                       <option key = {Bar.item}>
                                         {Bar.name}
                                       </option>
                                     )
                                   }
                                  </Input>


        //Drop Down to select a shift:
        const selectShiftsForAnalytics =
                                  <Input type ="select" >
                                     {
                                       this.state.Shifts.map(Shifts =>
                                         <option key = {Shifts.day}>
                                           {Shifts.day}
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


              <div className = "firstset">

                    <div className = "selection">
                        <h2> Select a Bar: </h2>
                        {selectBar}
                        <h2> Select a Bartender: </h2>
                        {selectBartender}
                        {ld}
                        <hr/>
                        <Button size="lg" onClick={this.getCountsSold}>Get Information</Button>
                    </div>
                    <div className = "bartenderinfo">
                        {alrt}
                        {countsoldby}
                        {itemsoldbar}

                    </div>

              </div>
              <hr/>

              <div className = "selection">
                  <h2> Select a Bar: </h2>
                  {selectBarForAnalytics}
                  <h2> Select a Day: </h2>
                  {selectShiftsForAnalytics}
                  <hr/>

                  <Button size="lg" >Get Information</Button>
              </div>



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
        this.setState( { Bars: data, BarsForAnalytics: data, BarsIsLoading:false, CurrentBarSelected: data[0].name, SelectedBar: data[0].name}) ;
        //console.log(data);
        this.getBartenders(data[0].name);
        this.getShiftDays(data[0].name);
      });



  }


  //Listens for Bar change
  barSelectionChanged(e){
    this.setState({CurrentBarSelected: e.target.value, InformationCanLoad:false});
    this.getBartenders(e.target.value);
  }

    analyticsBarSelectionChanged(e){
      console.log("Skrt " + e.target.value);
      this.setState({SelectedBar: e.target.value});
      this.getShiftDays(e.target.value);
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

    });

    //this.setState({InformationCanLoad: true});

  }

  getCountsSold(){


    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getBartenderSales',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        "bar": this.state.CurrentBarSelected,
        "bartender": this.state.CurrentBartenderSelected,
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { ItemsSoldByBartender: data, InformationCanLoad: false}) ;

      this.populateCountSoldByGraph(data);
    });

    this.setState({first: false});
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

  getShifts(){
      this.setState({first: false});
    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getShiftForBar',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        "bar": this.state.CurrentBarSelected,
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { ItemsSoldByBartender: data, InformationCanLoad: false}) ;
      console.log(data);

    });
  }


  getShiftDays(value){

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/getDaysWithShifts',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        "bar": value,
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { Shifts: data}) ;
      console.log(data);

    });
  }




  //Get Info
  getInfo(){
    this.setState({InformationCanLoad: true})
  }



}//Ends component i think

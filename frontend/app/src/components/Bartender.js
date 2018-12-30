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
    SelectedDate: [],
    AnalyticsHeader: ["bartender", "sold"],
    SoldToday: [],
    firstAnalytics: true,
    SoldTodayGraph: [],

    //SHIFTS
    ShiftsHeader: ["day", "shift"],
    ShiftsOnDay: [],

  }


  //Bind Functions
  this.getBars = this.getBars.bind(this);
  this.getCountsSold = this.getCountsSold.bind(this);
  this.getBartenders = this.getBartenders.bind(this);
  this.barSelectionChanged = this.barSelectionChanged.bind(this);
  this.bartenderSelectionChanged = this.bartenderSelectionChanged.bind(this);
  this.populateCountSoldByGraph = this.populateCountSoldByGraph.bind(this);
  this.analyticsBarSelectionChanged = this.analyticsBarSelectionChanged.bind(this);
  this.getShiftDays = this.getShiftDays.bind(this);
  this.analyticsDateSelectionChanged = this.analyticsDateSelectionChanged.bind(this);
  this.getAnalytics = this.getAnalytics.bind(this);
  //this.populateSoldByBartenderOnDayGraphForAnalytics = this.populateSoldByBartenderOnDayGraphForAnalytics(this);
  this.getShiftsWorkedByThisBartender = this.getShiftsWorkedByThisBartender.bind(this);
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

    var alrt2;

    if(this.state.SoldToday.length === 0 && !this.state.firstAnalytics){
      alrt2 = <Alert color = "danger" >There were no sales at this bar on this day! Tough Economy! Try another day.</Alert>
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
                               <tr>
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



const countbeerssold = <Table width={100}>
                  <thead style={{fontSize:'22px', textAlign:'center'}}>
                    <tr>
                    {
                      this.state.AnalyticsHeader.map(header =>
                     <th key={header}>
                     {header}
                     </th>
                     )
                   }
                    </tr>
                  </thead>
                  <tbody style={{fontSize:'15px', textAlign:'center'}}>
                  {

                    this.state.SoldToday.map((res, x) => {
                      return (
                           <tr>
                             {this.state.AnalyticsHeader.map((header, i) => {

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






  const graphOfWhatBartendersHaveSold =    <XYPlot animation={true} xType="ordinal" width={1000} height={500} className={"test"} margin={{bottom: 100, left: 100} } >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickLabelAngle={335}/>
                 <YAxis title="Quantity"/>
                <VerticalBarSeries data={this.state.SoldTodayGraph} color="skyblue"/>
              </XYPlot>


//Testing shifts worked


const shiftsw = <Table width={100}>
                  <thead style={{fontSize:'22px', textAlign:'center'}}>
                    <tr>
                    {
                      this.state.ShiftsHeader.map(header =>
                     <th key={header}>
                     {header}
                     </th>
                     )
                   }
                    </tr>
                  </thead>
                  <tbody style={{fontSize:'15px', textAlign:'center'}}>
                  {

                    this.state.ShiftsOnDay.map((res, x) => {
                      return (
                           <tr>
                             {this.state.ShiftsHeader.map((header, i) => {

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






//End shifts












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
                                  <Input type ="select" onChange={this.analyticsDateSelectionChanged}>
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
                              <div className ="scrollxf ">
                                <h2>Counts Sold:</h2>
                                {countsoldby}
                              </div>
                              <div className ="scrollxf ">
                              <h2>Shifts Worked:</h2>
                              {shiftsw}
                              </div>

                    </div>

                      {itemsoldbar}

              </div>


              <hr/>

              <div className = "firstset">

                      <div className = "selection2">
                          <h2> Select a Bar: </h2>
                          {selectBarForAnalytics}
                          <h2> Select a Day: </h2>
                          {selectShiftsForAnalytics}
                          {alrt2}
                          <hr/>
                          <Button size="lg" onClick={this.getAnalytics} >Get Analytics</Button>
                      </div>

                      <div className = "bartenderinfo">
                        {countbeerssold}
                        <div className = "aaabbb">

                              {graphOfWhatBartendersHaveSold}
                        </div>

                      </div>

              </div>

        </div>

       );

     }

  }
  //Ends render

//TESTING Shifts
getShiftsWorkedByThisBartender(){

  //console.log("Bar: " + this.state.CurrentBarSelected);
  //console.log("Bartender: " + this.state.CurrentBartenderSelected);



  fetch('http://127.0.0.1:5000/api/getShiftsWorked',{
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
    this.setState( { ShiftsOnDay: data}) ;
    console.log(data);

  });
}

//END TEST SHIFTS




  //Gets all bars
  getBars(){

    fetch('http://127.0.0.1:5000/api/getBars',{
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
      this.setState({SelectedBar: e.target.value});
      this.getShiftDays(e.target.value);
    }

    analyticsDateSelectionChanged(e){
        this.setState({SelectedDate: e.target.value});
        this.forceUpdate();
    }

  bartenderSelectionChanged(e){
    this.setState({CurrentBartenderSelected: e.target.value, InformationCanLoad:false});
  }


  //Gets Bartenders from CurrentBarSelected
  getBartenders(value){

    fetch('http://127.0.0.1:5000/api/getBartendersByBar',{
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


    fetch('http://127.0.0.1:5000/api/getBartenderSales',{
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
      this.getShiftsWorkedByThisBartender();
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
    fetch('http://127.0.0.1:5000/api/getShiftForBar',{
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

    fetch('http://127.0.0.1:5000/api/getDaysWithShifts',{
      method: "post",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        "bar": value,
      }),

      }).then(res => res.json()
    ).then(data => {
      this.setState( { Shifts: data, SelectedDate: data[0].day}) ;
      console.log(data);

    });
  }

//Get count sold by all the bartenders at a given bar on a given day.
getCountsSoldOnDay(){

  fetch('http://127.0.0.1:5000/api/getSoldByDay',{
    method: "post",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify({
      "bar": this.state.SelectedBar,
      "date": this.state.SelectedDate,
    }),

    }).then(res => res.json()
  ).then(data => {
    this.setState( { SoldToday: data}) ;
    //console.log(data);
    this.populateSoldByBartenderOnDayGraphForAnalytics(data);

  });

}

getAnalytics(){
  //console.log("Clicked");
  this.setState({firstAnalytics:false});
  //console.log("BAR: " + this.state.SelectedBar);
  //console.log("DATE: " +  this.state.SelectedDate);
  this.getCountsSoldOnDay();

}


  populateSoldByBartenderOnDayGraphForAnalytics(data){

    let g = [];

    if(data.length === 0)
        {
        g[0] = {x: "None", y: 0};
        this.setState({SoldTodayGraph: g});
        //this.setState({graphItems: {x: "None", y: 0} });
        return;
        }
      else{
        for(var i in data){
            g[i] = {x: data[i].bartender, y: data[i].sold}
          }
        }
        this.setState({SoldTodayGraph:g });
        console.log(g);
        this.forceUpdate();
        return;
  }







}//Ends component i think

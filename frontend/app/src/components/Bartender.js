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
    InformationCanLoad: false,

  }


  //Bind Functions
  this.getBars = this.getBars.bind(this);
  this.getInfo = this.getInfo.bind(this);
  this.getBartenders = this.getBartenders.bind(this);
  this.barSelectionChanged = this.barSelectionChanged.bind(this);
  this.bartenderSelectionChanged = this.bartenderSelectionChanged.bind(this);

}

  componentDidMount() {
    this.getBars();
  }



 // renders a view to the web page
  render(){
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

                  <Button size="lg" onClick={this.getInfo}>Get Information</Button>
              </div>

              <div className = "information">

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

  //Get Info
  getInfo(){
    this.setState({InformationCanLoad: true})
  }



}//Ends component i think

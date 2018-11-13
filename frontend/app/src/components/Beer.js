import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Progress,
    Button,
    Table,
} from 'reactstrap'; // Table pre-built component from reactstrap library
import './Beer.css'


class Beer extends Component {




  constructor(props) {
    super(props);

  this.state = {
    Beer: null,
    Manufacturer: null,
    data: [],
    manuData: [],
    tableHeaders: [],
    manutableHeader: [],
    isLoading: true,
    manutableIsLoading: true,
  };

  this.getBeers = this.getBeers.bind(this);

  this.beerSelectionChanged = this.beerSelectionChanged.bind(this);


}

componentDidMount() {
  this.getBeers();
}

beerSelectionChanged(e){
  console.log(e.target.value);
  this.setState({Beer: e.target.value});



  for (var i in this.state.data){

    if(e.target.value === this.state.data[i].Beer){
      this.setState({Manufacturer: this.state.data[i].Manufacturer});
    }
  }
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



  render(){


    if(this.state.isLoading){
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
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




        return (
          <div className="glb">

          <div className="firstTable">
              <div className="tlb_sel">
                  <Input type="select" name="select" onChange={this.beerSelectionChanged} >
                  {
                    this.state.data.map(Beer =>
                      <option key={Beer.item}>
                        {Beer.Beer}
                      </option>
                    )
                  }
              </Input>
              <Button style={{ }}onClick={this.getManf}> Get Info</Button>
              </div>


              <div className="tlb">

                {table}
              </div>

          </div>

          <div className="beerinsight">

            <h1> Beer Insight </h1>
            <h2> Beer: {this.state.Beer} </h2>
            <h2> Manufacturer: {this.state.Manufacturer} </h2>


          </div>

          </div >


        )


    }



}//ends return









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

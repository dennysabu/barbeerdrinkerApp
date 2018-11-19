import React from 'react';

// NavBar css
import styles from './NavBar.css';

// Reactstrap styling for components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';

// Endpoint (url) routing
import {
  Route,
  NavLink as DomNavLink,
  HashRouter
} from "react-router-dom";

// Routes of web page
import Home from "./Home";
import Beer from "./Beer";
import Drinker from "./Drinker";
import Bar from "./Bar";
import Bartender from "./Bartender";
import Manufacturer from "./Manufacturer";
import Modifications from "./Modifications";

// NavBar component
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    // state of page
    this.state = {
      isOpen: false,
      modal: false,
      queryResults: [],
      tableHeaders: [],
      text: "",
    };

    // allows for 'this' keyword
    this.toggle = this.toggle.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.queryHandler = this.queryHandler.bind(this);
    this.qTextHandler = this.qTextHandler.bind(this);
  }

  // when a toggle event happens for a query opening Modal component
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  // query text handler to change the text state to what is currently typed in query bar
  qTextHandler(event) {

    this.setState({
      text: event.target.value
    });
  }

  // query button pressed event to make http requeest to API
  queryHandler() {

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/query',{
        method: 'post',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          query: this.state.text
        }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.hasOwnProperty("sqlMessage"))
        {
        alert(data.sqlMessage);
        } else {
        // sets state of page to data recieved from query
        this.setState({ queryResults: data, headers: Object.keys(data[0]), modal: !this.state.modal })
        }
    });

  }

  // closes or opens Modal event
  searchHandler() {
    this.setState({
        modal: !this.state.modal
    });
  }

  // Renders JSX to screen (UI)
  render() {

    // state constants
    const qResults = this.state.queryResults;
    const headers = this.state.headers;
    const modalBody = this.state.queryResults;
    let body; // JSX to render

  // Conditional Render
  // Assigns body constant to JSX data
  // if query returns nothing
 if (modalBody.length === 0) {
   body = <p></p>
 } else { // if query returns more than 0 records
   body = <Table>
     <thead style={{fontSize:'22px', textAlign:'center'}}>
       <tr>
       {

         this.state.headers.map(header =>
        <th key={header}>
        {header}
        </th>
        )

      }
       </tr>
     </thead>
     <tbody style={{fontSize:'15px', textAlign:'center'}}>
     {

       qResults.map((res, x) => {
         return (
              <tr>
                {headers.map((header, i) => {

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
 }

    // Returns whats actually loaded into the UI
    return (
      <HashRouter>
      {/*
        NavBar - setup with buttons and NavLinks to Route(s)
      */}
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/" style={{ font: "32px Tahoma", fontWeight: "bolder" }}>
          Beerazon <span role="img" aria-label="beer">🍺</span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar className="Nav" style={styles}>

              <NavItem>
              <NavLink exact to="/" tag={DomNavLink} style={{ color: "black" }}>Home</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/beers" tag={DomNavLink} style={{ color: "black" }}>Beers</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/drinkers" tag={DomNavLink} style={{ color: "black" }}>Drinkers</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/bars" tag={DomNavLink} style={{ color: "black" }}>Bars</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/bartenders" tag={DomNavLink} style={{ color: "black" }}>Bartenders</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/manufacturers" tag={DomNavLink} style={{ color: "black" }}>Manufacturers</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/modifications" tag={DomNavLink} style={{ color: "black" }}>Modifications</NavLink>
              </NavItem>

            </Nav>
          <InputGroup className="search" onChange={this.qTextHandler}>
          <Input placeholder="Query Here..."/>
          <InputGroupAddon addonType="append">
            <Button onClick={this.queryHandler}>Query</Button>
          </InputGroupAddon>
        </InputGroup>

        <Modal size="lg" isOpen={this.state.modal} toggle={this.searchHandler} className={this.props.className}>
         <ModalHeader toggle={this.searchHandler}>Query Results</ModalHeader>
         <ModalBody>
         {body}
         </ModalBody>
       </Modal>

          </Collapse>
        </Navbar>
        {/*
          Router: - routes to pages and paths for a spa
        */}
        <div className="content">
        <Route exact path="/" component={Home}/>
        <Route path="/beers" component={Beer}/>
        <Route path="/drinkers" component={Drinker}/>
        <Route path="/bars" component={Bar}/>
        <Route path="/bartenders" component={Bartender}/>
        <Route path="/manufacturers" component={Manufacturer}/>
        <Route path="/modifications" component={Modifications}/>
        </div>
        </div>

      </HashRouter>
    );
  }
}

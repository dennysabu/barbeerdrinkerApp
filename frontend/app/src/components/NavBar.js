import React from 'react';
import styles from './NavBar.css';
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

import {
  Route,
  NavLink as DomNavLink,
  HashRouter
} from "react-router-dom";

// Routes
import Home from "./Home";
import Beer from "./Beer";
import Drinker from "./Drinker";
import Bar from "./Bar";
import Bartender from "./Bartender";
import Manufacturer from "./Manufacturer";


export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      modal: false,
      queryResults: [],
      tableHeaders: [],
    };

    this.toggle = this.toggle.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.queryHandler = this.queryHandler.bind(this);
    this.qTextHandler = this.qTextHandler.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  qTextHandler(event) {

    this.setState({
      text: event.target.value
    });
  }

  queryHandler() {

    fetch('/query',{
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
        this.setState({ queryResults: data, headers: Object.keys(data[0]), modal: !this.state.modal })
        }
    });

  }

  searchHandler() {
    this.setState({
        modal: !this.state.modal
    });
  }

  render() {
    const qResults = this.state.queryResults;
    const headers = this.state.headers;
    const modalBody = this.state.queryResults;
    let body;

 if (modalBody.length === 0) {
   body = <p></p>
 } else {
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

    return (
      <HashRouter>
      {/*
        NavBar - setup with buttons and NavLinks to Route(s)
      */}
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/" style={{ font: "32px cursive, courier", fontWeight: "bolder" }}>
          Beerazon 🍺
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
        </div>
        </div>

      </HashRouter>
    );
  }
}

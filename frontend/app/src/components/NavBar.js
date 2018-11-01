import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import {
  Route,
  NavLink as DomNavLink,
  HashRouter
} from "react-router-dom";

import Home from "./Home";
import Beer from "./Beer";
import Drinker from "./Drinker";

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <HashRouter>
      {/*
        NavBar - setup with buttons and NavLinks to Route(s)
      */}
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Beer Drinker PLUS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav pills>
              <NavItem>
                <NavLink exact to="/" tag={DomNavLink}>Home</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/beer" tag={DomNavLink}>Beer</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/drinker" tag={DomNavLink}>Drinker</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        {/*
          Router: - routes to pages and paths for a spa
        */}
        <div className="content">
        <Route exact path="/" component={Home}/>
        <Route path="/beer" component={Beer}/>
        <Route path="/drinker" component={Drinker}/>
        </div>
        </div>

      </HashRouter>
    );
  }
}

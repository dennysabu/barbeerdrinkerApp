import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import './NavBar.css';
import Home from "./Home";
import Beer from "./Beer";

import {
  Route,
  NavLink as DomNavLink,
  HashRouter
} from "react-router-dom";

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
            <Nav className="nav-pill" pills>
              <NavItem>
                <NavLink exact to="/" tag={DomNavLink}>Home</NavLink>
              </NavItem>
              <NavItem>
                 <NavLink exact to="/beer" tag={DomNavLink}>Beer</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Drinkers
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Graphs
                  </DropdownItem>
                  <DropdownItem>
                    Statistics
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Search
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
        {/*
          Router: - routes to pages and paths for a spa
        */}
        <div className="content">
        <Route exact path="/" component={Home}/>
        <Route path="/beer" component={Beer}/>
        </div>
        </div>

      </HashRouter>
    );
  }
}

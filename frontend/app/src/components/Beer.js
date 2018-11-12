import React, { Component } from "react";

class Beer extends Component {
  render() {
    return (
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
    );
  }
}

export default Beer;

import React, { Component } from 'react';
import {
    Input,
    Button,
    Progress,
    Badge,
    Modal,
    ModalBody,
    ModalHeader,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';

export default class Modifications extends Component {
    constructor(props) {
      super(props);

      this.state = {
        modification: "Update",
        table: "Bars",
        attributes: [],
        values: [[]],
        billitems: [],
        billitem: {billid: '', bar: '', item: '', price: ''},
        itemAttributes: [],
        condition: "",
        isLoading: false,
      };

      this.checkNulls = this.checkNulls.bind(this);
      this.conditionChange = this.conditionChange.bind(this);
      this.attributeChange = this.attributeChange.bind(this);
      this.modifyDatabase = this.modifyDatabase.bind(this);
      this.getAttributes = this.getAttributes.bind(this);
      this.modificationChange = this.modificationChange.bind(this);
      this.tableChange = this.tableChange.bind(this);
      this.addItemHandler = this.addItemHandler.bind(this);
      this.itemChanged = this.itemChanged.bind(this);
    }

    componentDidMount() {
      this.getAttributes(this.state.table, this.state.modification);
    }

    modificationChange(e) {

      if (this.state.table === "Bills" && e.target.value === "Update")
      {
          alert('Sorry Bills is not allowed to be updated!');
          e.target.value = this.state.modification
      } else {
      this.setState({
        modification: e.target.value,
      });
        this.getAttributes(this.state.table, e.target.value);
      }
    }

    tableChange(e) {

      if (e.target.value === "Bills" && this.state.modification === "Update")
      {
          alert('Sorry Bills is not allowed to be updated!');
          e.target.value = this.state.table
      } else {
      this.setState({
        table: e.target.value,
      });
        this.getAttributes(e.target.value, this.state.modification);
      }

    }

    conditionChange(e) {
      this.setState({
        condition: e.target.value,
      });
    }

    // Assign 2d array (dictionary) of attributes for record to enter
    attributeChange(e) {

        var values = this.state.values;
        var value = e.target.value;
        var name = e.target.name;
        var index = e.target.attributes.getNamedItem('index').value;

        var tmp = [name, value];

        for (var i in values) {

        if (tmp[0] !== values[i][0] && values.length >= i) {
              values[i][index] = tmp;
              break;
          }
        }
    }

    itemChanged(e) {
      var values = this.state.billitems;
      var value = e.target.value;
      var name = e.target.name;
      var index = e.target.attributes.getNamedItem('index').value;

      let copyObj = Object.assign({}, this.state.billitem);
      copyObj[name] = value;

      this.setState({
          billitem: copyObj
      });
    }

    addItemHandler(e) {

      var nFlag = 0;
      var item = this.state.billitem;

      for (var i in item) {
        if (item[i] === '')
        {
          nFlag = 1;
          alert('Error: Null found for item attribute');
          break;
        }
      }

      if (nFlag === 0)
      {
      this.setState( prevState => ({
        billitems: [...this.state.billitems, this.state.billitem]
      }));
      alert('Item Added!');
    }

    }


 // renders a view to the web page
  render() {

        var conditionView = <div>
                          <p>Where?:</p>
                          <InputGroup onChange={this.conditionChange} style={{width:'50%'}}>
                          <Input placeholder='column="value"' />
                          </InputGroup>
                          </div>

        var defAV = attributesView;

        var attributesView =
                            this.state.attributes.map((header, i) => {
                              return (
                                <div key={i} style={{width:'50%'}}>
                                <InputGroup>
                                <Input placeholder="value" name={header} index={i} onChange={this.attributeChange}/>
                                <InputGroupAddon addonType="prepend">{header}</InputGroupAddon>
                                </InputGroup>
                                <br/>
                                </div>
                              );
                            })

          var indexBill_Items = this.state.attributes.indexOf("bartender");
          var bill = this.state.attributes.slice(0, indexBill_Items+1);
          var item = this.state.attributes.slice(indexBill_Items+1, this.state.attributes.length);
          var billsAttributesView = <div>
                                    {
                                    bill.map((header, i) => {

                                      return (
                                        <div key={i} style={{width:'50%'}}>
                                        <InputGroup>
                                        <Input placeholder="value" name={header} index={i} onChange={this.attributeChange}/>
                                        <InputGroupAddon addonType="prepend">{header}</InputGroupAddon>
                                        </InputGroup>
                                        <br/>
                                        </div>
                                      );
                                    })
                                  }
                                    <br/>
                                    <br/>
                                    <br/>
                                    <div styles={{marginLeft: '0'}}>
                                    <Button outline color="secondary" onClick={this.addItemHandler}>Add Item</Button>
                                    </div>
                                    <br/>
                                    {
                                    item.map((header, i) => {

                                      return (
                                        <div key={i} style={{width:'50%'}}>
                                        <InputGroup>
                                        <Input placeholder="value" name={header} index={i} onChange={this.itemChanged}/>
                                        <InputGroupAddon addonType="prepend">{header}</InputGroupAddon>
                                        </InputGroup>
                                        <br/>
                                        </div>
                                      );
                                    })

                                  }
                                    </div>

          var tablesSelector =
                            <Input type="select" name="select" onChange={this.tableChange} style={{width:'50%'}}>
                            <option>Bars</option>
                            <option>Bartenders</option>
                            <option value="Bills">Bills/Bill_Items</option>
                            <option>Drinkers</option>
                            <option>Frequents</option>
                            <option>Inventory</option>
                            <option>Items</option>
                            <option>Likes</option>
                            <option>Sells</option>
                            <option>Shifts</option>
                            </Input>


        var defMS =  <Input type="select" name="select" onChange={this.modificationChange} style={{width:'50%'}}>
                          <option>Update</option>
                          <option>Delete</option>
                          <option>Insert</option>
                          </Input>

    if(this.state.isLoading) {
      return(
        <Progress multi>
         <Progress bar animated color="blue" value="100"/>
       </Progress>
      )
    } else {

      switch (this.state.modification) {

        case "Insert":
            conditionView = <div></div>
            if (this.state.table === "Bills")
            {
              defAV = billsAttributesView
            } else {
              defAV = attributesView
            }
            break;
        case "Delete":

        if (this.state.table === "Bills")
        {
          defAV = <div>
                        {
                        bill.map((header, i) => {
                            return (
                                <div key={i}>
                                <Badge>{header}</Badge>
                                </div>
                              );
                            })
                            }
                          <br/>
                          </div>
          } else {
            defAV = <div>
                          {
                          this.state.attributes.map((header, i) => {
                              return (
                                  <div key={i}>
                                  <Badge>{header}</Badge>
                                  </div>
                                );
                              })
                              }
                            <br/>
                            </div>
          }
          break;
        case "Update":
          if (this.state.table === "Bills")
          {
            defAV = billsAttributesView
          } else {
            defAV = attributesView
          }
          break;
          default:
            break;
      }

    return (
      <div align="center">
      <br/>
      <br/>
       <div className="column">
         <label>Select Modification:</label>
        {
          defMS
        }
        <br/>
        <label>Select Table:</label>
        {
          tablesSelector
        }
        <br/>
        {
          defAV
        }
        {
          conditionView
        }
    <br/>
    <Button outline color="secondary" onClick={this.checkNulls} style={{width:'25%'}}>{this.state.modification}</Button>
    <br/>
    <br/>
    <br/>
    </div>

    </div>

       );
     }
  }

  checkNulls() {
    var attr = this.state.attributes;
    var isNull = 0;

    var values = this.state.values[0];

    for (var i = 0; i < attr.length; i++) {
     if (i >= values.length)
     {
       values[i] = [attr[i], 'NULL'];
     }
   }

    for (var j = 0; j < values.length; j++) {
      if (values[0][j] === '' || attr.length != values.length || values[0][j] === 'NULL')
      {
        isNull = 1;
        alert('Error: null value detected for attributes');
        break;
      }
    }

    if (isNull !== 1)
    {
      this.modifyDatabase();
    }

  }

  modifyDatabase() {


    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/modifyDatabase', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         modification: this.state.modification,
         table: this.state.table,
         values: this.state.values[0].splice(0,this.state.values[0].length-4),
         items: this.state.billitems,
         condition: this.state.condition,
     }),
   }).then(res => {
     if (res.status === 200)
     {
       alert('Successul ' + this.state.modification + ' to the ' + this.state.table + ' table!');
        return res.json();
     } else if (res.sqlMessage === undefined) {
       alert('Invalid Modification, Please Check Your "Where" Syntax and Table Selection 😭');
    } else {
       alert(res.sqlMessage);
    }
   });

  }


  getAttributes(table, mod) {

    fetch('http://ec2-18-206-201-243.compute-1.amazonaws.com:5000/api/query', {
    method: "POST",
    headers: {
             "Content-Type": "application/json", // enables json content only
         },
    body: JSON.stringify({
         query: "SELECT * FROM " + table + " LIMIT 1",
     }),
     }).then(res => res.json()
   ).then(data => {

     if (table === "Bills" && mod !== "Update")
     {
       var at = Object.keys(data[0]);
       at.push("billid", "item", "bar", "price");
       var iat = ["billid", "item", "bar", "price"];

       this.setState({ attributes: at, itemAttributes: iat,  table: table, isLoading: false });
    } else if (table === "Bills" && mod === "Update") {

      this.setState({ table: table, modification: mod });
    } else {

       this.setState({ attributes: Object.keys(data[0]), table: table, isLoading: false });
     }

   });
  }

}

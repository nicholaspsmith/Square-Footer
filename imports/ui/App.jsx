import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import { Costs } from '../api/costs.js';

import Task from './Task.jsx';

class App extends Component {

  addTask(event) {
    event.preventDefault();

    const width = ReactDOM.findDOMNode(this.refs.widthInput).value.trim();
    const length = ReactDOM.findDOMNode(this.refs.lengthInput).value.trim();

    if (width.length > 0 && length.length > 0 && !isNaN(width) && !isNaN(length)) {
      const squareFeet = width * length * 0.00694444;

      Tasks.insert({
        width,
        length,
        squareFeet,
        createdAt: new Date(), // current time
      });
    }

    // Clear form
    ReactDOM.findDOMNode(this.refs.widthInput).value = '';
    ReactDOM.findDOMNode(this.refs.lengthInput).value = '';
  }

  totalSqFt() {
    let total = 0;
    this.props.tasks.forEach(function (task) {
      total += task.squareFeet;
    });
    return total.toFixed(2);
  }

  totalCost() {
    let total = this.totalSqFt();//not most efficient way
    if (this.props.costs[0]){
      return (total * +this.props.costs[0].cost).toFixed(2);
    }
    return 0;
  }

  updateRate(e) {
    e.preventDefault();
    const costs = Costs.find().fetch();
    const newRate = +ReactDOM.findDOMNode(this.refs.costPerSqFt).value.trim();
    Costs.update({ _id: costs[0]._id }, {
      $set: { cost: newRate }
    });
  }

  getInitialRate() {
    const costs = Costs.find().fetch();
    console.log(costs);
    if (costs.length > 0) {
      return costs[0].cost;
    }
  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Square Footage</h1>
        </header>

        <div className="total clearfix">Total Cost: ${this.totalCost()}</div>

        <form className="pricePer clearfix" onSubmit={this.updateRate.bind(this)}>
          <div>Price per sq/ft</div>
          <input type="number" step="0.01" ref="costPerSqFt" placeholder={this.getInitialRate()} />
          <input type="submit" value="Calculate" />
        </form>

        <ul className="clearfix list">
          {this.renderTasks()}
        </ul>
        <div className="total area clearfix">Total Area: {this.totalSqFt()} sq/ft</div>

        <form className="clearfix" onSubmit={this.addTask.bind(this)}>
          <input type="number" step="0.1" ref="widthInput" placeholder="width (in)"/>x
          <input type="number" step="0.1" ref="lengthInput" placeholder="length (in)"/>
          <input className="add" type="submit" value="+" />
        </form>


      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find().fetch(),
    costs: Costs.find().fetch(),
  };
}, App);

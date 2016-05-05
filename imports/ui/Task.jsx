import React, { Component, PropTypes } from 'react';

import { Tasks } from '../api/tasks.js';

export default class Task extends Component {

  deleteThisTask() {
    if (confirm("Are you sure?")) {
      Tasks.remove(this.props.task._id);
    }
  }

  render() {
    return (
      <li>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        {this.props.task.width}x
        {this.props.task.length}&nbsp;=&nbsp;
        {this.props.task.squareFeet.toFixed(2)} sq/ft
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
}

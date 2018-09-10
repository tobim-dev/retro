import React from "react";
import socketIO from "socket.io-client";

import Button from "./common/Button";
import { LOCAL_BACKEND_ENDPOINT, CREATE_COLUMN } from "../utils/constants";

export default class BoardColumnForm extends React.Component {
  state = { title: "" };

  closeModal = () => document.querySelector(".custom-modal > button").click();

  handleTitleChange = event => this.setState({ title: event.target.value });

  handleSubmit = event => {
    event.preventDefault();

    const socket = socketIO(LOCAL_BACKEND_ENDPOINT);
    const { title } = this.state;
    const { boardColumnsCount } = this.props;
    const id = `column-${boardColumnsCount + 1}`;

    const newColumn = { id, title, itemIds: [] };
    socket.emit(CREATE_COLUMN, newColumn);

    this.setState({ title: "" });
    this.closeModal();
  };

  render() {
    const { title } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">Column Title</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={title}
              onChange={this.handleTitleChange}
              placeholder="New Column Title"
            />
          </div>
        </div>
        <Button type="submit" className="is-info is-rounded">
          Submit
        </Button>
      </form>
    );
  }
}

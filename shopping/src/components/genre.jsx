import React from "react";
import {Link, IndexLink} from "react-router";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
    }

    handleClick(genreID) {
        this.props.handleClick(genreID);
        this.setState({active: true});
    }

    render() {
        return (
            <div className={"row-genres " + (this.props.active ? "active" : "")}>
                <a className="mdl-navigation__link" href="#" key={this.props.genre.id} 
                    onClick={event => this.handleClick(this.props.genre.id)}>{this.props.genre.name}</a>
            </div>
        );
    }
}

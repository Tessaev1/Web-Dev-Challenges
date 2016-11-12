import React from "react";
import {Link, IndexLink} from "react-router";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(genreID) {
        this.props.handleClick(genreID);
    }

    render() {
        return (
            <div className="row-genres">
                <Link className="mdl-navigation__link" href="#" activeClassName="active" key={this.props.genre.id} 
                    onClick={event => this.handleClick(this.props.genre.id)}>{this.props.genre.name}</Link>
            </div>
        );
    }
}

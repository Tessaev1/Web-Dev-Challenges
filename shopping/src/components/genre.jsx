import React from "react";

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
                <a className="mdl-navigation__link" href="#" key={this.props.genre.id} 
                    onClick={event => this.handleClick(this.props.genre.id)}>{this.props.genre.name}</a>
            </div>
        );
    }
}

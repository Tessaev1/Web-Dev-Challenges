import React from "react";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {query: ""};
    }

    handleChange(event) {
        this.setState({query: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.props.onSearch) {
            this.props.onSearch(this.state.query);
        }
    }

    render() {
        return (
            <form action="#" onSubmit={event => this.handleSubmit(event)}>
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" 
                        value={this.state.query}
                        placeholder="Search"
                        onChange={event => this.handleChange(event)}>
                    </input>
                </div>
            </form>
        );
    }
}
import React from "react";

import "../css/main.css";

import {Link, IndexLink} from "react-router";
import {store} from "./shared-state.js";

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }

     componentDidMount() {
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    componentWillUnmount() {
        this.unsub();
    }

    // https://webdesign.tutsplus.com/tutorials/learning-material-design-lite-navigation--cms-24565
    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">Movie Shopper</span>
                        <div className="mdl-layout-spacer"></div>
                        <nav className="mdl-navigation">
                            <IndexLink className="mdl-navigation__link" to="/" activeClassName="active">
                                <i className="material-icons">search</i>
                            </IndexLink>
                            <IndexLink className="mdl-navigation__link" to="/cart" activeClassName="active">
                                <i className="material-icons">shopping_cart</i>
                                ({this.state.cart.length})
                            </IndexLink>
                        </nav>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">Settings</span>
                </div>
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

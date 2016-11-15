import React from "react";
import {store, removeFromCart} from "./shared-state.js";
import Movie from "./movie.jsx";

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }

    componentDidMount() {
        //subscribe to the store: i.e., ask the store to call a function
        //whenever the data in the store changes. When that occurs, use 
        //this.setState() to reset our state, which will trigger a re-render
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    /**
     * componentWillUnmount() is called just before this component is
     * removed ("unmounted") from the page. When react-router switches
     * from this component to the users list component, this component
     * is unmounted and removed from the page. When that happens we need
     * to unsubscribe from the redux store, so that we don't try to 
     * call .setState() while the component is unmounted. 
     */
    componentWillUnmount() {
        //Use the unsubscribe function that was returned from store.subscribe()
        //which we saved as our `unsub` class property.
        this.unsub();
    }

    render() {
        var movies;
        if (this.state.cart) {
            movies = this.state.cart.map(record =>
            <Movie key={record.id} movie={record}>
                <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" 
                    onClick={() => store.dispatch(removeFromCart(record.id))}>Remove
                </button>
            </Movie>);
        }
        return (
            <div className="container">
                <h1>Shopping Cart</h1>
                <div className="movie-list">
                    {movies}                
                </div>
            </div>
        );
    }
}
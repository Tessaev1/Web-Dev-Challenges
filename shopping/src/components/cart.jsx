import React from "react";
import {store, removeFromCart} from "./shared-state.js";
import Movie from "./movie.jsx";

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

    render() {
        var movies;
        if (this.state.cart) {
            movies = this.state.cart.map(record => (
                <div className="row-cart-item" key={record.movie.id}>
                    <div className="col">
                        <Movie key={record.movie.id} movie={record.movie}>
                            <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" 
                                onClick={() => store.dispatch(removeFromCart(record.movie.id))}>Remove
                            </button>
                        </Movie>
                    </div>
                    <div className="col">{record.format}</div>
                    <div className="col">{record.quantity}</div>
                    <div className="col">{record.price}</div> 
                </div>
            ));
        }
        return (
            <div className="container-cart">
                <h2>Shopping Cart</h2>
                <div className="row-cart-header">
                    <div className="col-movie-card"></div>
                    <div className="col">Format</div>
                    <div className="col">Quantity</div>
                    <div className="col">Price</div>                
                </div>
                <hr/>
                {movies}
            </div>
        );
    }
}
import React from "react";
import {store, removeFromCart} from "./shared-state.js";
import Movie from "./movie.jsx";
import numeral from "numeral";

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

    calculateSum() {
        var total = 0;
        this.state.cart.map(function(item) {
            total += item.quantity * item.price;
        })
        return total;
    }

    render() {
        var movies;
        if (this.state.cart) {
            movies = this.state.cart.map(record => (
                <div className="row-cart-item" key={record.id}>
                    <div className="col">
                        <Movie key={record.id} movie={record.movie}>
                            <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" 
                                onClick={() => store.dispatch(removeFromCart(record.id))}>Remove
                            </button>
                        </Movie>
                    </div>
                    <div className="col">{record.format}</div>
                    <div className="col">{record.quantity}</div>
                    <div className="col">{numeral(record.price * record.quantity).format('$0,0.00')}</div> 
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
                <hr />
                <div>
                    {movies}
                </div>
                <hr />
                <div className="row-cart-footer">
                    <div className="col">Cart Total = {numeral(this.calculateSum()).format('$0,0.00')}</div>
                </div>
            </div>
        );
    }
}
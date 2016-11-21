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

    handleQuantityChange(item, quantity) {
        item.quantity = quantity;
        this.forceUpdate();
    }

    render() {
        var movies;
        if (this.state.cart.length > 0) {
            movies = this.state.cart.map(item => (
                <div className="row-cart-item" key={item.id}>
                    <div className="col">
                        <Movie key={item.id} movie={item.movie}>
                            <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" 
                                onClick={() => store.dispatch(removeFromCart(item.id))}>Remove
                            </button>
                        </Movie>
                    </div>
                    <div className="col">{item.format}</div>
                    <div className="col">
                        <button className="mdl-button mdl-js-button quantity-button"
                            onClick={() => this.handleQuantityChange(item, item.quantity-1)}
                            disabled={item.quantity === 1}>
                            <i className="material-icons">remove_circle_outline</i>
                        </button>
                        <span>{item.quantity}</span>
                        <button className="mdl-button mdl-js-button quantity-button"
                            onClick={() => this.handleQuantityChange(item, item.quantity+1)}>
                            <i className="material-icons">add_circle_outline</i>
                        </button>
                    </div>
                    <div className="col">{numeral(item.price * item.quantity).format('$0,0.00')}</div> 
                </div>
            ));
        } else {
            movies = (
                <h4>There are no items in your shopping cart</h4>
            );
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
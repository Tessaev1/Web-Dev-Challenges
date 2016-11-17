import {createStore} from "redux";

const ADD_TO_CART = "addToCart";
const REMOVE_FROM_CART = "removeFromCart";

const DEFAULT_STATE = {cart: []};

const LS_KEY = "redux-store";

function reducer(state, action) {
    switch(action.type) {
        case ADD_TO_CART:
            // if (state.cart.find(item => item.id === action.item.id)) {
            //     // increment cart quantity
            //     return state;
            // }
            return Object.assign({}, state, {cart: state.cart.concat(action.item)});            
        case REMOVE_FROM_CART:
            return Object.assign({}, state, {cart: state.cart.filter(item => item.movie.id != action.id)});
        default:
            return state;
    }
}

export function addToCart(item, format, quantity, price) {
    return {
        type: ADD_TO_CART,
        item: {
            movie: item,
            format: format,
            id: item.id + format,
            quantity: quantity,
            price: price * quantity
        } 
    }
}

export function removeFromCart(id) {
    return {
        type: REMOVE_FROM_CART,
        id: id
    }
}

var savedState = JSON.parse(localStorage.getItem(LS_KEY));

export var store = createStore(reducer, savedState || DEFAULT_STATE);

store.subscribe(() => localStorage.setItem(LS_KEY, JSON.stringify(store.getState())));

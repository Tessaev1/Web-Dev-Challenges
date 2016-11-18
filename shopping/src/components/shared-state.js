import {createStore} from "redux";

// const DECREMENT_QUANTITY = "decrementQuantity";
// const INCREMENT_QUANTITY = "incrementQuantity";
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
            return Object.assign({}, state, {cart: state.cart.filter(item => item.id != action.id)});
        default:
            return state;
    }
}

export function addToCart(item) {
    return {
        type: ADD_TO_CART,
        item: item
    }
}

export function removeFromCart(id) {
    return {
        type: REMOVE_FROM_CART,
        id: id
    }
}

//load any previously-saved state from local storage and
//parse it as JSON. Since local storage can only save strings
//we need to encode/decode the state as a JSON string
//if we get `undefined` from localStorage.getItem(), JSON.parse()
//will also return `undefined` (with no error).  
var savedState = JSON.parse(localStorage.getItem(LS_KEY));

//create the Redux store, passing a reference to our reducer function
//and the initial state (either the previously-saved state, or the 
//DEFAULT_STATE if nothing has been saved yet)
export var store = createStore(reducer, savedState || DEFAULT_STATE);

//subscribe to the store: i.e., as the store to call a function
//whenever the data in the store changes. Our function will save
//the new state to local storage, so that we can reload it again
//when the user refreshes the page, or comes back to it later.
store.subscribe(() => localStorage.setItem(LS_KEY, JSON.stringify(store.getState())));

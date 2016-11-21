import React from "react";
import {render} from "react-dom";

import App from "./components/app.jsx";
import Cart from "./components/cart.jsx";
import Products from "./components/products.jsx";

import {Router, Route, IndexRoute, hashHistory} from "react-router";

"use strict";

var router = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Products}></IndexRoute>
            <Route path="/cart" component={Cart}></Route> 
        </Route> 
    </Router>
);

render(router, document.getElementById("app"));

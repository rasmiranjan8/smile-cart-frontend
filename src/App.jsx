import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import routes from "routes";

import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import PageNotFound from "./components/Commons/PageNotFound";
import Product from "./components/Product";
import ProductList from "./components/ProductList";

const App = () => (
  <>
    {/* <div className="flex space-x-2">
        <NavLink exact activeClassName="underline font-bold" to="/">
          Home
        </NavLink>
        <NavLink exact activeClassName="underline font-bold" to="/product">
          Product
        </NavLink>
      </div> */}

    <Switch>
      <Route exact component={Product} path={routes.products.show} />
      <Route exact component={ProductList} path={routes.products.index} />
      <Route exact component={Cart} path={routes.cart} />
      <Route exact component={Checkout} path={routes.checkout} />

      <Redirect exact from="/" to={routes.products.index} />

      <Route exact component={PageNotFound} path="*" />
    </Switch>
  </>
);

export default App;

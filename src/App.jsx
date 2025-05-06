import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import { useState } from "react";
import CartItemsContext from "./contexts/CartItemsContext";
import ProductList from "./components/ProductList";
import Product from "./components/Product";
import PageNotFound from "./components/Commons/PageNotFound";
import routes from "routes";
import Cart from "./components/Cart"

const App = () => {
  return (
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

        <Redirect exact from="/" to={routes.products.index} />
        <Route exact component={PageNotFound} path="*" />
      </Switch>
    </>
  );
};

export default App;

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
//Routes
import { LOGIN } from "../../configs/routes";

export const AuthRoute = ({ component: Component, ...rest }) => {
  const authenticated = useSelector((state) => state.user.authenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Redirect to={LOGIN} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

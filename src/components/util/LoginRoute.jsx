import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
//Routes
import { HOME } from "../../configs/routes";

export const LoginRoute = ({ component: Component, ...rest }) => {
  const authenticated = useSelector((state) => state.user.authenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Redirect to={HOME} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

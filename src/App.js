import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import jwtDecode from "jwt-decode";
//Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthRoute } from "./components/util/AuthRoute";
import { LoginRoute } from "./components/util/LoginRoute";
//Redux
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./redux/store";
import { getUserData, logoutUser } from "./redux/actions/userActions";
import { getProducts } from "./redux/actions/productsActions";
import { SET_AUTHENTICATED } from "./redux/types";
//MUI
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
//Layout
import { NavBar } from "./components/layout/NavBar";
import { Drawer } from "./components/layout/Drawer";
//Pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Products } from "./pages/Products";
import { User } from "./pages/User";
import { About } from "./pages/About";
//Routes
import { HOME, PRODUCTS, LOGIN, SIGNUP, USER, ABOUT } from "./configs/routes";
//Configs
import themeConfig from "./configs/theme";
import { UIHandler } from "./configs/uihandler";

const theme = createMuiTheme(themeConfig);

axios.defaults.baseURL =
  "https://asia-east2-first-shopping-app-bf21e.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

const App = () => {
  const [UIHandle, setUIHandle] = useState({
    NavDrawer: false,
  });

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <UIHandler.Provider value={[UIHandle, setUIHandle]}>
          <Render />
        </UIHandler.Provider>
      </Provider>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  boxContent: {
    backgroundColor: "#fff8e1",
  },
  containerContent: {
    minHeight: "calc(100vh - 64px)",
    paddingTop: theme.spacing(2),
    backgroundColor: "#e8f5e9",
  },
}));

const Render = () => {
  const userId = useSelector((state) => state.user.credentials.userId);
  const classes = useStyles();
  const dispatch = useDispatch();

  dispatch(getProducts({ sortmethod: "count", order: "desc" }));

  return (
    <Router>
      <NavBar />
      <Drawer />
      <Box className={classes.boxContent}>
        <Container className={classes.containerContent}>
          <Switch>
            <Route exact path={HOME} component={Home} />
            <Route path={ABOUT} component={About} />
            <LoginRoute path={LOGIN} component={Login} />
            <LoginRoute path={SIGNUP} component={Signup} />
            <Route path={PRODUCTS} component={Products} />
            <AuthRoute path={USER + `/${userId}`} component={User} />
          </Switch>
        </Container>
      </Box>
    </Router>
  );
};
export default App;

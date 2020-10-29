import {
  SET_USER,
  LOADING_USER,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_UNAUTHENTICATED,
  STOP_LOADING_UI,
} from "../types";
import axios from "axios";

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user/get")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      history.go(-1);
      dispatch({ type: CLEAR_ERRORS });
      dispatch(getUserData());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUser, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUser)
    .then((res) => {
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      history.push("/");
      dispatch({ type: CLEAR_ERRORS });
      dispatch(getUserData());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const edituserdata = (newdata) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/user/edit", newdata)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleChangePassword = (newPassword) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/user/resetpassword", newPassword)
    .then((res) => {
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleAddShoppingcart = (data) => (dispatch) => {
  let format = {
    data: data,
  };
  axios
    .post("/shoppingcart/add", format)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleIncreaseShoppingcart = (productId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/shoppingcart/edit/${productId}/increase`)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleDecreaseShoppingcart = (productId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/shoppingcart/edit/${productId}/decrease`)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleRemoveItemShoppingcart = (productId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .delete(`/shoppingcart/edit/${productId}/delete`)
    .then((res) => {
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const cleanShoppingcart = () => (dispatch) => {
  axios
    .delete("/shoppingcart/delete")
    .then((res) => {
      dispatch(getUserData());
      console.log("shoppingcart cleaned!");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createOrder = (data) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/order/create", data)
    .then((res) => {
      console.log(res.data);
      dispatch(cleanShoppingcart());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const handleApplyCancelOrder = (orderId, data) => (dispatch) => {
  axios
    .post(`/order/edit/${orderId}`, data)
    .then((res) => {
      console.log(`${orderId}編輯成功`);
      dispatch(getUserData());
    })
    .catch((err) => {
      console.log(err);
    });
};

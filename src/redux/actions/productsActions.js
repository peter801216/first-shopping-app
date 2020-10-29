import axios from "axios";
import {
  GET_PRODUCTS,
  LOADING_PRODUCTS,
  STOP_LOADING_PRODUCTS,
} from "../types";

export const getProducts = (condition) => (dispatch) => {
  dispatch({ type: LOADING_PRODUCTS });
  axios
    .post("/products", condition)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_PRODUCTS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const productClickCount = (productId) => (dispatch) => {
  axios
    .get(`/products/${productId}`)
    .then((res) => {
      console.log(`${productId} 點閱次數+1`);
    })
    .catch((err) => {
      console.log(err);
    });
};

import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  LOADING_PRODUCTS,
  STOP_LOADING_PRODUCTS,
} from "../types";

const initialState = {
  loading: false,
  errors: false,
  productloading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: false,
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case LOADING_PRODUCTS:
      return {
        ...state,
        productloading: true,
      };
    case STOP_LOADING_PRODUCTS:
      return {
        ...state,
        productloading: false,
      };
    default:
      return state;
  }
}

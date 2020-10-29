import { GET_PRODUCTS } from "../types";

const initialState = {
  products: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

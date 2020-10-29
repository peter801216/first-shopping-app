import React from "react";
//Redux
import { useSelector } from "react-redux";
//Components
import { EmptyShoppingcart } from "../shoppingcart/EmptyShoppingcart";
import { ShoppingcartContent } from "../shoppingcart/ShoppingcartContent";

export const Shoppingcartlist = () => {
  const shoppingcartlist = useSelector((state) => state.user.shoppingcart);

  return shoppingcartlist.length === 0 ? (
    <EmptyShoppingcart />
  ) : (
    <ShoppingcartContent shoppingcartlist={shoppingcartlist} />
  );
};

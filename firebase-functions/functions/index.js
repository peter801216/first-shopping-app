const functions = require("firebase-functions");
const { db } = require("./util/firebaseAdmin");

const cors = require("cors");
const app = require("express")();
const FBAuth = require("./util/firebaseAuth");

app.use(cors());

// user handlers
const {
  signup,
  login,
  getUserData,
  editUserData,
  createOrder,
  userHandleOrder,
  managerHandleOrder,
  addToShoppingcart,
  handleIncreaseShoppingcart,
  handleDecreaseShoppingcart,
  removeItemFromShoppingcart,
  cleanShoppingcart,
  resetPassword,
} = require("./handlers/user");
app.post("/signup", signup); //signup OK
app.post("/login", login); //login OK
app.get("/user/get", FBAuth, getUserData); //getUserData OK
app.post("/user/edit", FBAuth, editUserData); //editUserData OK
app.post("/user/resetpassword", FBAuth, resetPassword); //resetPassword
app.post("/order/create", FBAuth, createOrder); //createOrder OK
app.post("/order/edit/:orderId", FBAuth, userHandleOrder); //userHandleOrder OK
app.post("/order/edit/:orderId/manager", FBAuth, managerHandleOrder); //managerHandleOrder OK
app.post("/shoppingcart/add", FBAuth, addToShoppingcart); //addToShoppingcart OK
app.get(
  "/shoppingcart/edit/:productId/increase",
  FBAuth,
  handleIncreaseShoppingcart
); //handleIncreaseShoppingcart OK
app.get(
  "/shoppingcart/edit/:productId/decrease",
  FBAuth,
  handleDecreaseShoppingcart
); //handleDecreaseShoppingcart OK
app.delete(
  "/shoppingcart/edit/:productId/delete",
  FBAuth,
  removeItemFromShoppingcart
); //removeItemFromShoppingcart OK
app.delete("/shoppingcart/delete", FBAuth, cleanShoppingcart); //cleanShoppingcart OK

//products handlers
const {
  getProducts,
  getProduct,
  productPlusCount,
} = require("./handlers/products");
app.post("/products", getProducts); //取得商品列表，需填入排列方式 OK
app.get("/product/:productId", getProduct); //OK
app.get("/products/:productId", productPlusCount); //productPlusCount OK

exports.api = functions.region("asia-east2").https.onRequest(app);

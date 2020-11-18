const { admin, db } = require("../util/firebaseAdmin");
const firebase = require("firebase");

const { firebaseConfig } = require("../util/firebaseConfig");

firebase.initializeApp(firebaseConfig);

const {
  validateSignupData,
  validateLoginData,
  validateUserInfo,
} = require("../util/formValidation");

//註冊
exports.signup = (req, res) => {
  const newUser = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let token, userId;

  db.doc(`/users/${newUser.phone}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: `此號碼已經被註冊` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const newUserData = {
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        info: {
          address: "",
          bankCode: "",
          accountNumber: "",
        },
        manager: false,
        userId: userId,
      };
      return db.doc(`/users/${newUser.phone}`).set(newUserData);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: `此帳號已註冊` });
      } else {
        return res.status(500).json({ general: "發生錯誤，請再試一次" });
      }
    });
};

//登入
exports.login = (req, res) => {
  const user = {
    phone: req.body.phone,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  db.doc(`/users/${user.phone}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(403).json({ general: "此帳號不存在" });
      } else {
        user.email = doc.data().email;

        return firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then((data) => {
            return data.user.getIdToken();
          })
          .then((token) => {
            return res.json({ token });
          })
          .catch((err) => {
            if (err.code === "auth/wrong-password") {
              return res.status(403).json({ password: "密碼錯誤，請再試一次" });
            } else {
              console.error(err);
              return res.status(500).json({ error: "登入發生錯誤" });
            }
          });
      }
    });
};

//取得用戶資料
exports.getUserData = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.phone}`)
    .get()
    .then((doc) => {
      userData.credentials = doc.data();
      return db.doc(`/shoppingcart/${req.user.phone}`).get();
    })
    .then((doc) => {
      let shoppingcartData = [];
      if (doc.exists) {
        shoppingcartData = doc.data().content;
      }

      userData.shoppingcart = shoppingcartData;

      if (req.user.manager) {
        return db.collection("orders").orderBy("createdAt", "desc").get();
      } else {
        return db
          .collection("orders")
          .where("userHandle", "==", req.user.phone)
          .orderBy("createdAt", "desc")
          .limit(10)
          .get();
      }
    })
    .then((data) => {
      userData.orderData = [];
      data.forEach((doc) => {
        userData.orderData.push({
          name: doc.data().name,
          address: doc.data().address,
          phone: doc.data().phone,
          createdAt: doc.data().createdAt,
          content: doc.data().content,
          totalPrice: doc.data().totalPrice,
          handle: doc.data().handle,
          userHandle: doc.data().userHandle,
          finish: doc.data().finish,
          orderId: doc.id,
          shipment: doc.data().shipment,
          paid: doc.data().paid,
          applyCancel: doc.data().applyCancel,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.log("取得用戶資料錯誤");
      return res.status(500).json({ error: err.code });
    });
};

//編輯用戶資料
exports.editUserData = (req, res) => {
  db.doc(`/users/${req.user.phone}`)
    .get()
    .then((doc) => {
      const originData = doc.data();
      return originData;
    })
    .then((data) => {
      let editData = data;
      if (req.body.name) {
        editData.name = req.body.name;
      }
      if (req.body.info.address) {
        editData.info.address = req.body.info.address;
      }
      if (req.body.info.bankCode) {
        editData.info.bankCode = req.body.info.bankCode;
      }
      if (req.body.info.accountNumber) {
        editData.info.accountNumber = req.body.info.accountNumber;
      }
      return editData;
    })
    .then((data) => {
      db.doc(`/users/${req.user.phone}`)
        .update(data)
        .then(() => {
          console.log("編輯個人資料成功");
          return res.json(data);
        })
        .catch((err) => {
          console.error("編輯個人資料失敗");
          return res.status(500).json({ error: err.code });
        });
    });
};

//創造訂單
exports.createOrder = (req, res) => {
  let newOrder = {
    userHandle: req.user.phone,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    accountNumber: req.body.accountNumber,
    bankCode: req.body.bankCode,
    content: req.body.content,
    createdAt: new Date().toISOString(),
    totalPrice: req.body.totalPrice,
    shipment: false,
    paid: false,
    finish: false,
    applyCancel: false,
  };

  db.collection("orders")
    .add(newOrder)
    .then((doc) => {
      const responseOrder = newOrder;
      responseOrder.orderId = doc.id;
      console.log("成功新增訂單");
      return res.json(responseOrder);
    })
    .catch((err) => {
      console.error("新增訂單發生錯誤");
      return res.status(500).json({ error: err.code });
    });
};

//用戶編輯*已下定*訂單
exports.userHandleOrder = (req, res) => {
  if (req.user.manager) {
    console.log("此為客戶端功能");
    return res.json({ error: "This is client handle function" });
  }
  let userhandle = {};

  if (req.body.paid) {
    userhandle.paid = req.body.paid;
  }

  if (req.body.applyCancel) {
    userhandle.applyCancel = req.body.applyCancel;
  }

  const orderDocument = db.doc(`/orders/${req.params.orderId}`);

  orderDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("找不到此筆訂單");
        return res.status(404).json({ error: "Order not found" });
      } else if (doc.data().finish === true) {
        console.log("此訂單已經完成");
        return res.json({ error: "This order has been finished" });
      } else {
        orderDocument.set(userhandle, { merge: true });
        return orderDocument.get();
      }
    })
    .then((doc) => {
      let oringinData = doc.data();
      console.log("修改訂單成功");
      return res.json(oringinData);
    })
    .catch((err) => {
      console.log("搜尋訂單發生問題");
      return res.status(500).json({ error: err.code });
    });
};

//管理者管理*已下定*訂單//此處須測試兩個return的狀況
exports.managerHandleOrder = (req, res) => {
  // if (!req.user.manager) {
  //   console.log("此為管理員功能");
  //   return res.json({ error: "This is manager handle function" });
  // }

  let userhandle = {};

  if (req.body.shipment) {
    userhandle.shipment = req.body.shipment;
  }

  if (req.body.finish) {
    userhandle.finish = req.body.finish;
  }

  if (req.body.paid) {
    userhandle.paid = req.body.paid;
  }

  if (req.body.applyCancel) {
    userhandle.applyCancel = req.body.applyCancel;
  }

  const orderDocument = db.doc(`/orders/${req.params.orderId}`);
  const error = false;

  orderDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("找不到此筆訂單");
        error = "Order not found";
        return error;
      }
    })
    .catch((err) => {
      console.log("搜尋訂單發生問題");
      error = err.code;
      return error;
    });

  if (error) {
    return res.status(500).json({ error: error });
  }

  orderDocument
    .update(userhandle)
    .then(() => {
      return orderDocument.get();
    })
    .then((doc) => {
      let newOrder = doc.data();
      console.log("修改訂單成功");
      return res.json(newOrder);
    })
    .catch((err) => {
      console.log("更新訂單發生問題");
      return res.status(500).json({ error: err.code });
    });
};

//加入購物車
exports.addToShoppingcart = (req, res) => {
  let newData = req.body.data;

  let shoppingcartData;

  const shoppingcartDoc = db.doc(`/shoppingcart/${req.user.phone}`);

  shoppingcartDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        shoppingcartData = doc.data();
      } else {
        shoppingcartData = {
          content: [],
        };
      }
      return shoppingcartData;
    })
    .then((shoppingcartData) => {
      if (shoppingcartData.content.length === 0) {
        db.collection("shoppingcart")
          .doc(req.user.phone)
          .set({
            content: [newData],
          });

        return res.json({
          content: [...newData],
        });
      } else {
        let tempData, tempIndex;
        let checkItem = shoppingcartData.content.map((el, index) => {
          if (el.productId === newData.productId) {
            tempIndex = index;
            return true;
          } else {
            return false;
          }
        });

        if (checkItem.includes(true)) {
          tempData = {
            content: [...shoppingcartData.content],
          };
          tempData.content[tempIndex] = newData;
        } else {
          tempData = {
            content: [...shoppingcartData.content, newData],
          };
        }

        shoppingcartDoc.set(tempData, { merge: true });
        return res.json(tempData);
      }
    })
    .catch((err) => {
      console.log("新增購物車失敗");
      return res.status(500).json({ error: err.code });
    });
};

//增減購物車物品數量
exports.handleIncreaseShoppingcart = (req, res) => {
  const shoppingcartDoc = db.doc(`/shoppingcart/${req.user.phone}`);
  let originData = {};
  shoppingcartDoc
    .get()
    .then((doc) => {
      originData = doc.data();
      let tempData = originData.content.map((product) => {
        if (product.productId === req.params.productId) {
          return {
            productId: product.productId,
            quantity: product.quantity + 1,
          };
        } else {
          return product;
        }
      });

      const newData = {
        content: [...tempData],
      };

      shoppingcartDoc.set(newData);
      return res.json(newData);
    })
    .catch((err) => {
      console.log("購物車商品+1失敗");
      res.status(500).json({ error: err.code });
    });
};

exports.handleDecreaseShoppingcart = (req, res) => {
  const shoppingcartDoc = db.doc(`/shoppingcart/${req.user.phone}`);

  let originData = {};
  shoppingcartDoc
    .get()
    .then((doc) => {
      originData = doc.data();
      let tempData = originData.content.map((product) => {
        if (product.productId === req.params.productId) {
          return {
            productId: product.productId,
            quantity: product.quantity - 1,
          };
        } else {
          return product;
        }
      });

      const newData = {
        content: [...tempData],
      };

      shoppingcartDoc.set(newData);
      return res.json(newData);
    })
    .catch((err) => {
      console.log("購物車商品-1失敗");
      res.status(500).json({ error: err.code });
    });
};

//刪除購物車內商品
exports.removeItemFromShoppingcart = (req, res) => {
  let originData = {};
  const shoppingcartDoc = db.doc(`shoppingcart/${req.user.phone}`);
  shoppingcartDoc
    .get()
    .then((doc) => {
      originData = doc.data();
      let tempData = [];
      originData.content.forEach((product) => {
        if (product.productId !== req.params.productId) {
          tempData.push(product);
        }
      });
      const newData = {
        content: [...tempData],
      };
      shoppingcartDoc.set(newData);
      return res.json(newData);
    })
    .catch((err) => {
      console.log("購物車商品刪除失敗");
      res.status(500).json({ error: err.code });
    });
};

//清空購物車
exports.cleanShoppingcart = (req, res) => {
  const shoppingcartDoc = db.doc(`/shoppingcart/${req.user.phone}`);

  shoppingcartDoc
    .delete()
    .then(() => {
      return res.json({ message: "shoppingcart had cleaned out successfully" });
    })
    .catch((err) => {
      console.log("清理購物車失敗");
      return res.status(500).json({ error: err.code });
    });
};

exports.resetPassword = (req, res) => {
  if(!req.phone) {
    return res.json({message: 'Not login'})
  }
  const newPassword = req.body.password;
  firebase
    .auth()
    .currentUser
    .updatePassword(newPassword)
    .then(() => {
      console.log(newPassword);
      return res.json({ state: "密碼更新成功" });
    })
    .catch((err) => {
      console.log(err);
    });
};

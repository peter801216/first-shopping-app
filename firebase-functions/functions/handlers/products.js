const { json } = require("express");
const { db } = require("../util/firebaseAdmin");

exports.getProducts = (req, res) => {
  db.collection("products")
    .orderBy(`${req.body.sortmethod}`, `${req.body.order}`)
    .get()
    .then((data) => {
      let products = [];
      data.forEach((doc) => {
        products.push({
          productId: doc.data().productId,
          title: doc.data().title,
          price: doc.data().price,
          unit: doc.data().unit,
          quantity: doc.data().quantity,
          discount: doc.data().discount,
          sellerId: doc.data().sellerId,
          imageUrl: doc.data().imageUrl,
          category: doc.data().category,
          sold: doc.data().sold,
          count: doc.data().count,
        });
      });
      return res.json(products);
    })
    .catch((err) => {
      console.err(err);
      console.log("getProducts not work");
    });
};

exports.productPlusCount = (req, res) => {
  let originData, newData;
  db.doc(`/products/${req.params.productId}`)
    .get()
    .then((doc) => {
      originData = doc.data();
      newData = {
        ...originData,
        count: originData.count + 1,
      };
      return newData;
    })
    .then((data) => {
      db.doc(`/products/${req.params.productId}`)
        .set(data)
        .then(() => {
          return res.json(data);
        });
    })
    .catch((err) => {
      console.err(err);
      console.log("點閱數+1失敗");
    });
};

exports.getProduct = (req, res) => {
  db.doc(`/products/${req.params.productId}`)
    .get()
    .then((doc) => {
      const data = {
        imageUrl: doc.data().imageUrl,
        price: doc.data().price,
        discount: doc.data().discount,
        title: doc.data().title,
        unit: doc.data().unit,
      };

      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "get product data fail" });
    });
};

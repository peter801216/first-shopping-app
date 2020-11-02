const { db, admin } = require("./firebaseAdmin");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.name = data.docs[0].data().name;
      req.user.phone = data.docs[0].data().phone;
      req.user.info = data.docs[0].data().info;
      req.user.manager = data.docs[0].data().manager;
      return next();
    })
    .catch((err) => {
      console.error(`middleWare problem`);
      return res.status(403).json(err);
    });
};

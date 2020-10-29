import React, { Fragment, useState } from "react";
//Routes
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../configs/routes";
import { useHistory } from "react-router-dom";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContentText from "@material-ui/core/DialogContentText";
//Components
import { ShoppingcartCard } from "./ShoppingcartCard";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "800px",
  },
  title: {
    margin: "10px auto 0px auto",
    fontWeight: "bolder",
    textAlign: "center",
  },
  cardfield: {
    width: 350,
    height: 150,
    marginBottom: 20,
  },
  btn: {
    margin: 10,
  },
  checkbtn: {
    margin: "10px 123px 10px 123px",
  },
  checkbox: {
    margin: "10px 106px 10px 106px",
  },
  textField: {
    margin: "0px auto 20px auto",
  },
  subtitle1: {
    position: "relative",
    textAlign: "left",
  },
  subtitle2: {
    position: "relative",
    textAlign: "right",
  },
  dialog: {
    fontWeight: "bolder",
    color: "black",
  },
}));

export const ShoppingcartContent = (props) => {
  const classes = useStyles();
  const { shoppingcartlist } = props;
  //購物車清單
  const datalist = Object.values(shoppingcartlist).map((productData) => {
    return (
      <Grid item className={classes.cardfield} key={productData.productId}>
        <ShoppingcartCard productData={productData} />
      </Grid>
    );
  });
  //計算總金額
  const products = useSelector((state) => state.products);
  const productsHandle = Object.values(shoppingcartlist).map((item) => {
    const id = item.productId;
    const qty = item.quantity;
    Object.values(products).forEach((el) => {
      if (id === el.productId) {
        item.price = el.price * el.discount * qty;
      }
    });
    return item;
  });
  const cost = productsHandle.reduce((total, el) => {
    return total + el.price;
  }, 0);
  //操作結帳功能
  const [checkBody, setcheckBody] = useState({ open: false, defer: false });
  const handleOpenCheckBody = (open) => {
    setcheckBody({
      open: open,
      defer: false,
    });
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        購物車
      </Typography>
      <Grid container direction="column" alignItems="center">
        {datalist}
      </Grid>
      <Typography variant="subtitle1" className={classes.title}>
        總金額NT${cost}
      </Typography>
      <Grid container direction="row" justify="center">
        <Grid item>
          <Button
            className={classes.btn}
            component={Link}
            color="primary"
            variant="contained"
            size="large"
            to={PRODUCTS}
          >
            繼續購物
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.btn}
            color="secondary"
            variant="contained"
            size="large"
            onClick={() => handleOpenCheckBody(true)}
          >
            前往結帳
          </Button>
        </Grid>
      </Grid>
      <Fragment>
        {checkBody.open ? (
          <CheckBody productsHandle={productsHandle} cost={cost} />
        ) : null}
      </Fragment>
    </div>
  );
};

const CheckBody = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const credentials = useSelector((state) => state.user.credentials);
  const products = useSelector((state) => state.products);
  const { cost, productsHandle } = props;
  const [checked, setchecked] = useState(false);
  const [handleDialogs, sethandleDialogs] = useState(false);

  const [data, setdata] = useState({
    name: "",
    phone: "",
    address: "",
    accountNumber: "",
    bankCode: "",
    content: productsHandle,
    totalPrice: cost,
  });
  const [error, seterror] = useState({
    name: false,
    phone: false,
    address: false,
    bankCode: false,
    accountNumber: false,
  });

  const handleToggleChange = () => {
    seterror({
      name: false,
      phone: false,
      address: false,
      bankCode: false,
      accountNumber: false,
    });
    const handle = checked;
    setchecked(!handle);
    if (handle === false) {
      setdata({
        name: credentials.name,
        phone: credentials.phone,
        address: credentials.info.address,
        accountNumber: credentials.info.accountNumber,
        bankCode: credentials.info.bankCode,
        content: productsHandle,
        totalPrice: cost,
      });
    } else {
      setdata({
        name: "",
        phone: "",
        address: "",
        accountNumber: "",
        bankCode: "",
        content: productsHandle,
        totalPrice: cost,
      });
    }
  };

  const handleChange = (event) => {
    let handleError = error;

    handleError = {
      ...handleError,
      [event.target.name]: false,
    };

    seterror(handleError);

    if (event.target.name === "phone") {
      let phone = event.target.value;
      if (isNaN(phone) || phone.split("").includes(".") || phone.length > 10) {
      } else {
        setdata({
          ...data,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === "bankCode") {
      let bankCode = event.target.value;
      if (
        isNaN(bankCode) ||
        bankCode.split("").includes(".") ||
        bankCode.length > 3
      ) {
      } else {
        setdata({
          ...data,
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name === "accountNumber") {
      let accountNumber = event.target.value;
      if (
        isNaN(accountNumber) ||
        accountNumber.split("").includes(".") ||
        accountNumber.length > 5
      ) {
      } else {
        setdata({
          ...data,
          [event.target.name]: event.target.value,
        });
      }
    } else {
      setdata({
        ...data,
        [event.target.name]: event.target.value,
      });
    }
  };

  const checkEmpty = (data) => {
    if (data.trim() === "") {
      return true;
    } else {
      return false;
    }
  };

  const isCellphone = (phone) => {
    if (
      phone.length === 10 &&
      phone[0] === "0" &&
      phone[1] === "9" &&
      !isNaN(+phone) &&
      !phone.split("").includes(".")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    const submitData = data;
    let handleError = error;

    console.log(submitData);

    let errors = false;

    if (checkEmpty(submitData.name)) {
      errors = true;
      handleError = {
        ...handleError,
        name: "此欄圍必填資料",
      };
    }

    if (checkEmpty(submitData.phone)) {
      errors = true;
      handleError = {
        ...handleError,
        phone: "此欄圍必填資料",
      };
    }

    if (!isCellphone(submitData.phone)) {
      errors = true;
      handleError = {
        ...handleError,
        phone: "請輸入正確手機號碼",
      };
    }

    if (checkEmpty(submitData.address)) {
      errors = true;
      handleError = {
        ...handleError,
        address: "此欄圍必填資料",
      };
    }

    if (checkEmpty(submitData.bankCode)) {
      errors = true;
      handleError = {
        ...handleError,
        bankCode: "此欄圍必填資料",
      };
    }

    if (checkEmpty(submitData.accountNumber)) {
      errors = true;
      handleError = {
        ...handleError,
        accountNumber: "此欄圍必填資料",
      };
    }

    if (errors === true) {
      return seterror({
        ...handleError,
      });
    }
    dispatch(createOrder(submitData));
    setdata({
      name: "",
      phone: "",
      address: "",
      accountNumber: "",
      bankCode: "",
      content: productsHandle,
      totalPrice: cost,
    });

    sethandleDialogs(true);

    setTimeout(() => history.push("/"), 5000);
  };

  const purchaseList = productsHandle.map((el) => {
    const result = Object.values(products).filter(
      (product) => product.productId === el.productId
    );
    return (
      <div key={el.productId}>
        <Grid container direction="row">
          <Grid item style={{ width: 150 }}>
            <Typography className={classes.subtitle1}>
              {result[0].title}
            </Typography>
          </Grid>
          <Grid item style={{ width: 200 }}>
            <Typography className={classes.subtitle2}>
              x{el.quantity}
              {result[0].unit}
              {"       "}
              NT${el.price}
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  });

  return (
    <div className={classes.container}>
      <Divider />
      <Typography variant="h5" className={classes.title}>
        結帳
      </Typography>
      <Typography variant="subtitle1" className={classes.title}>
        購買商品:
      </Typography>
      {purchaseList}
      <Typography variant="subtitle1" className={classes.title}>
        總金額 NT${cost}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" className={classes.title}>
        訂購人資訊
      </Typography>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <FormControlLabel
            className={classes.checkbox}
            control={
              <Checkbox
                checked={checked}
                color="primary"
                onChange={handleToggleChange}
                name="checked"
              />
            }
            label="寄送同訂購人"
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            id="name"
            name="name"
            type="name"
            label="收件人姓名"
            variant="outlined"
            onChange={handleChange}
            error={error.name ? true : false}
            helperText={error.name}
            value={data.name}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            id="phone"
            name="phone"
            type="phone"
            label="收件人手機號碼"
            variant="outlined"
            onChange={handleChange}
            error={error.phone ? true : false}
            helperText={error.phone}
            value={data.phone}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            id="address"
            name="address"
            type="address"
            label="收件人地址"
            variant="outlined"
            onChange={handleChange}
            error={error.address ? true : false}
            helperText={error.address}
            value={data.address}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            id="bankCode"
            name="bankCode"
            type="bankCode"
            label="繳費銀行代碼"
            variant="outlined"
            onChange={handleChange}
            error={error.bankCode ? true : false}
            helperText={error.bankCode}
            value={data.bankCode}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.textField}
            id="accountNumber"
            name="accountNumber"
            type="accountNumber"
            label="繳費帳戶末五碼"
            variant="outlined"
            onChange={handleChange}
            error={error.accountNumber ? true : false}
            helperText={error.accountNumber}
            value={data.accountNumber}
          />
        </Grid>
      </Grid>
      <Button
        className={classes.checkbtn}
        color="secondary"
        variant="contained"
        size="large"
        onClick={handleSubmit}
      >
        送出訂單
      </Button>
      <Dialog open={handleDialogs}>
        <DialogContent>
          <DialogContentText className={classes.dialog}>
            新增訂單成功 5秒後自動跳轉
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

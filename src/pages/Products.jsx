import React, { useState, useEffect } from "react";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
//Components
import { ProductCard } from "../components/product/ProductCard";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions/productsActions";
//Routes
import { Link } from "react-router-dom";
import { PRODUCTS } from "../configs/routes";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "50vw",
    minWidth: "240px",
    height: "80px",
    backgroundColor: "#fffde7",
    margin: "15px auto 15px auto",
    borderBottom: "2px solid #9e9e9e",
    borderRight: "2px solid #9e9e9e",
    borderRadius: "5px",
  },
  containerSmall: {
    width: "50vw",
    minWidth: "240px",
    height: "160px",
    backgroundColor: "#fffde7",
    margin: "15px auto 15px auto",
    borderBottom: "2px solid #9e9e9e",
    borderRight: "2px solid #9e9e9e",
    borderRadius: "5px",
  },
  title: {
    fontWeight: "bolder",
    textDecorationLine: "none",
    color: "black",
  },
  layoutBtn: {
    margin: "5px 10px auto 10px",
  },
  formControl: {
    margin: "10px",
    minWidth: "150px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export const Products = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const matches = useMediaQuery("(max-width:780px)");
  const [sortmethod, setsortmethod] = useState("productId");
  const [categorymethod, setcategorymethod] = useState("all");
  const productsLoading = useSelector((state) => state.UI.productloading);

  const handleChangeSort = (event) => {
    setsortmethod(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setcategorymethod(event.target.value);
  };

  useEffect(() => {
    let method = { sortmethod: "count", order: "desc" };
    if (sortmethod === "low-high") {
      method = { sortmethod: "price", order: "asc" };
    } else if (sortmethod === "high-low") {
      method = { sortmethod: "price", order: "desc" };
    }

    return dispatch(getProducts(method));
  }, [sortmethod]);

  const productsdata = useSelector((state) => state.products);
  const list = [];
  Object.values(productsdata).forEach((product) => {
    if (categorymethod !== "all") {
      if (product.category.split("-").includes(categorymethod)) {
        list.push(product);
      }
    } else {
      list.push(product);
    }
  });

  const products = list.map((product) => {
    return <ProductCard key={product.imageUrl} product={product} />;
  });

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Typography
          variant="h5"
          component={Link}
          to={PRODUCTS}
          className={classes.title}
        >
          商品首頁
        </Typography>
      </Grid>
      <Grid item>
        <Container
          fixed
          className={matches ? classes.containerSmall : classes.container}
        >
          <Grid container direction="row" justify="center">
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel id="select label from sort">依價格排序</InputLabel>
                <Select
                  labelId="select label from sort"
                  id="select from sort"
                  value={sortmethod}
                  onChange={handleChangeSort}
                  label="sort"
                  native
                >
                  <option value="count">熱門</option>
                  <option value="low-high">由低至高</option>
                  <option value="high-low">由高至低</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel id="select label from category">分類</InputLabel>
                <Select
                  labelId="select label from category"
                  id="select from category"
                  value={categorymethod}
                  onChange={handleChangeCategory}
                  label="category"
                  native
                >
                  <option value="all">全部</option>
                  <option value="食品">食品</option>
                  <option value="水果">水果</option>
                  <option value="果乾">果乾</option>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item container direction="row" justify="center">
        {!productsLoading ? products : <p>Loading...</p>}
      </Grid>
    </Grid>
  );
};

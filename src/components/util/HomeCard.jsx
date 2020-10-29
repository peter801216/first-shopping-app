import React from "react";
import { Link } from "react-router-dom";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    position: "relative",
  },
  cardImage: {
    maxWidth: "1000px",
  },
  button: {
    position: "absolute",
    height: "50px",
    width: "180px",
    left: "80%",
    top: "90%",
    backgroundColor: "#212121",
    cursor: "pointer",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#616161",
    },
  },
}));

export const HomeCard = (props) => {
  const classes = useStyles();
  const { link, image, title, btnText } = props;
  return (
    <Card className={classes.cardContainer}>
      <CardMedia
        className={classes.cardImage}
        component="img"
        image={image}
        title={title}
      />
      <Link to={link}>
        <Button className={classes.button}>
          <Typography variant="h5">{btnText}</Typography>
        </Button>
      </Link>
    </Card>
  );
};

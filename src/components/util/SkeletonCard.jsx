import React from "react";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    backgroundColor: "#fafafa",
    height: 150,
    width: "100%",
  },
  textcontent: {
    width: 200,
    paddingLeft: 10,
    paddingTop: 10,
  },
}));

export const SkeletonCard = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Grid container direction="row">
        <Grid item>
          <Skeleton variant="rect" width={150} height={150} />
        </Grid>
        <Grid item container direction="column" className={classes.textcontent}>
          <Skeleton />
          <Skeleton width="60%" />
          <Skeleton width="60%" />
          <Skeleton width="60%" />
        </Grid>
      </Grid>
    </Paper>
  );
};

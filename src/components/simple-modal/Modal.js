import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { Button, FormHelperText, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: "center",
    margin: "20px",
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal({
  open,
  SetFile,
  progress,
  handleClose,
  handleComplete,
}) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);


  return (
    <Modal open={open} onClose={handleClose}>
       <div style={modalStyle} className={classes.paper}>
      {progress ? <div><h5>Plase do not close this window!</h5><CircularProgress disableShrink /></div> : <div><h3>Complete Task</h3>
      <TextField type="file" onChange={(e) => SetFile(e.target.files[0])} />
      <FormHelperText>
        Upload a file that is related to your task
      </FormHelperText>
      <br></br>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleComplete()}
      >
        Complete Task
      </Button></div> }
    </div>
    </Modal>
  );
}

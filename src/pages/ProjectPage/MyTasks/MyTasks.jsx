import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../components/Auth";
import { firestore } from "../../../firebase/firebase";
import TaskCard from "../../../components/task-card/TaskCard";
import styled from "styled-components";
import { Button, FormHelperText, TextField } from "@material-ui/core";
import Modal from "../../../components/simple-modal/Modal";
import { makeStyles } from '@material-ui/core/styles';
import PreLoader from "../../../shared/components/preloader/preloader";

function getModalStyle() {
  const top = 50 
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign:"center",
    margin:"20px",
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function MyTasks({ projectId }) {
  var { currentUser } = useContext(AuthContext);
  const [tasks, SetTasks] = useState([]);
  const [isPending, SetPending] = useState(true);
  const [open, SetOpen] = useState(false);
  const [file, SetFile] = useState(null);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const handleClose = () => {
    SetOpen(false);
  }

  const handleClick = () => {
    if(file){
     console.log(file);
     
    }
 
     // firestore
     //   .collection("projects")
     //   .doc(projectId)
     //   .collection("tasks")
     //   .doc(task.id)
     //   .update({ isCompleted: true })
     //   .catch((err) => console.log(err))
     //   .then(() => {
     //     var tmp = tasks.map((element) => {
     //       if (element.id === task.id) element.isCompleted = true;
     //       return element;
     //     });
     //     SetTasks(tmp);
     //   });
 
   };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h3>Complete Task</h3>
      <TextField type="file" onChange={(e) => SetFile(e.target.files[0])}/>
      <FormHelperText>Upload a file that is related to your task</FormHelperText><br></br>
      <Button variant="contained" color="primary" onClick={() => handleClick}> Complete Task </Button>
    </div>
  );

  

  useEffect(() => {
    SetPending(true);
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .where("members", "array-contains", currentUser.id)
      .get()
      .then((snapshot) => {
        var allTasks = snapshot.docs.map((task) => ({
          id: task.id,
          ...task.data(),
        }));
        SetTasks(allTasks);
        SetPending(false);
      });
  }, [projectId, currentUser]);
  return isPending ? (
    <PreLoader />
  ) : (
    <MyTasksWrapper>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          rest={
            !task.isCompleted && (
              <Button variant="outlined" onClick={() => SetOpen(true)}>
                Complete
              </Button>
            )
          }
        />
      ))}
      <Modal open = {open} body={body} handleClose={handleClose}/>
    </MyTasksWrapper>
  );
}
export default MyTasks;

const MyTasksWrapper = styled.div`
  font-size: 1.2em;
  margin: 15px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  button {
    transition-duration: 0.4s;
    border: 1px solid white;
    color: white;
  }
  button: hover {
    background-color: #4caf50;
  }
`;

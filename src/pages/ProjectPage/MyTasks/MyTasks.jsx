import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../components/Auth";
import { firestore } from "../../../firebase/firebase";
import UploadFile from "../../../utils/UploadFile";
import TaskCard from "../../../components/task-card/TaskCard";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Modal from "../../../components/simple-modal/Modal";
import PreLoader from "../../../shared/components/preloader/preloader";

function MyTasks({ projectId }) {
  var { currentUser } = useContext(AuthContext);
  const [tasks, SetTasks] = useState([]);
  const [isPending, SetPending] = useState(true);
  const [open, SetOpen] = useState(false);
  const [file, SetFile] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleClose = () => {
    SetOpen(false);
  };

  const handleClick = (task) => {
    SetOpen(true);
    setCurrentTask(task);
  };

  const handleComplete = async () => {
    if (file) {
      // Upload the file in task-files folder with current task's id
      var downloadURL = await UploadFile(
        file,
        setProgress,
        "task-files",
        currentTask.id
      );
      firestore
        .collection("projects")
        .doc(projectId)
        .collection("tasks")
        .doc(currentTask.id)
        .update({ isCompleted: true, attachedFile:downloadURL })
        .catch((err) => console.log(err))
        .then(() => {
          var tmp = tasks.map((element) => {
            if (element.id === currentTask.id) {
              element.isCompleted = true;
              element.attachedFile = downloadURL
            }
            return element;
          });
          SetTasks(tmp);
        }).catch((err) => console.log(err)).then(() => SetOpen(false));
    }
  };

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
  ) : tasks.length > 0 ? (
    <MyTasksWrapper>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          rest={
            !task.isCompleted && (
              <Button variant="outlined" onClick={() => handleClick(task)}>
                Complete
              </Button>
            )
          }
        />
      ))}
      <Modal
        open={open}
        SetFile={SetFile}
        progress={progress}
        handleClose={handleClose}
        handleComplete={handleComplete}
      />
    </MyTasksWrapper>
  ) : (
    <NoTaskWrapper>
      {" "}
      <h1>¯\_(ツ)_/¯</h1>
      <h5>You do not have any ongoing tasks right now 👍</h5>
    </NoTaskWrapper>
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
const NoTaskWrapper = styled.div`
  text-align: center;
  font-size: 1.2em;
  margin: 15px;
  padding: 15px;
`;

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../components/Auth";
import { firestore } from "../../../firebase/firebase";
import TaskCard from "../../../components/task-card/TaskCard";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import PreLoader from "../../../shared/components/preloader/preloader";

function MyTasks({ projectId }) {
  var { currentUser } = useContext(AuthContext);
  const [tasks, SetTasks] = useState([]);
  const [isPending, SetPending] = useState(true);

  const handleClick = (task) => {
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(task.id)
      .update({ isCompleted: true })
      .catch((err) => console.log(err))
      .then(() => {
        var tmp = tasks.map((element) => {
          if (element.id === task.id) element.isCompleted = true;
          return element;
        });
        SetTasks(tmp);
      });
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
  ) : (
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

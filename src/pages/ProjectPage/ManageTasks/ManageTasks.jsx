import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebase/firebase";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import CreateTask from "./CreateNewTask/CreateTask";
import TaskCard from "../../../components/task-card/TaskCard";
import PreLoader from "../../../shared/components/preloader/preloader";

function ManageTasks({ projectId }) {
  const [tasks, SetTasks] = useState([]);
  const [isPending, SetPending] = useState(true);
  const [open, SetOpen] = useState(false);

  const handleOpen = () => {
    SetOpen(true);
  };
  const handleClose = () => {
    SetOpen(false);
  };

  useEffect(() => {
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .get()
      .then((snapshot) => {
        var allTasks = snapshot.docs.map((task) => ({
          id: task.id,
          ...task.data(),
        }));
        SetTasks(allTasks);
        SetPending(false);
      });
  }, [projectId, open]);

  return (
    <ManageTaskWrapper>
      <Button variant="outlined" onClick={handleOpen}>
        Create New Task
      </Button>
      <br></br>
      {isPending ? (
        <PreLoader />
      ) : tasks.length > 0 ? (
        <div className="manage-task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div>
          <h1>¯\_(ツ)_/¯</h1>
          <h5>There is no ongoing tasks in this project</h5>
        </div>
      )}
      {open && <CreateTask projectId={projectId} handleClose={handleClose} />}
    </ManageTaskWrapper>
  );
}

export default ManageTasks;

const ManageTaskWrapper = styled.div`
  text-align: center;
  align-items: center;
  font-size: 1.2em;
  margin: 15px;
  padding: 15px;

  .manage-task-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

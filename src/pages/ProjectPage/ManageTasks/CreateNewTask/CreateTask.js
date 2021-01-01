import React, { useEffect, useState } from "react";
import { firestore } from "../../../../firebase/firebase";
import UserCard from "../../../../components/user-card/UserCard";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

const CreateTask = ({ projectId, handleClose }) => {
  const [name, SetName] = useState("");
  const [content, SetContent] = useState("");
  const [deadline, SetDeadline] = useState(null);
  const [queryInput, SetQueryInput] = useState("");
  const [users, SetUsers] = useState([]);
  const [taskMembers, SetMembers] = useState([]);
  const [isPending, SetPending] = useState(true);

  const cleanUp = () => {
    SetName("");
    SetContent("");
    SetDeadline(null);
    SetQueryInput("");
    SetUsers([]);
    SetMembers([]);
    SetPending(true);
  };

  const handleCreateTask = () => {
    if (name !== "" && content !== "" && taskMembers.length > 0) {
      firestore
        .collection("projects")
        .doc(projectId)
        .collection("tasks")
        .add({
          name,
          content,
          members: taskMembers.map((m) => m.id),
          deadline,
          isCompleted:false
        })
        .catch((err) => console.log(err))
        .then(() => handleClose());
   
    }
  };
  const handleAddUser = (user) => {
    let tmpUsers = users;
    let tmpMembers = taskMembers;
    tmpMembers.push(user);
    SetUsers(tmpUsers.filter((u) => u.id !== user.id));
    SetMembers(tmpMembers);
  };
  const handleRemoveUser = (user) => {
    var tmpUsers = users;
    tmpUsers.push(user);
    var tmpMembers = taskMembers;
    SetUsers(tmpUsers);
    SetMembers(tmpMembers.filter((u) => u.id !== user.id));
  };

  useEffect(() => {
    var promises = [];
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("members")
      .where("role", "!=", "Admin")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((member) => {
          promises.push(
            firestore
              .collection("users")
              .doc(member.id)
              .get()
              .then((user) => {
                return { id: user.id, ...user.data() };
              })
              .catch((err) => console.log(err))
          );
        });
        Promise.all(promises).then((fulfilledData) => {
          SetUsers(fulfilledData);
          SetPending(false);
        });
      });
    return () => {
      cleanUp();
    };
  }, [projectId]);

  return (
    <CreateTaskWrapper>
      <form onSubmit={() => handleCreateTask}>
        <div className="modal-top-right">
          <IconButton color={"secondary"} onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <TextField
          label={"Task Name"}
          required
          helperText="Name this task to find it later"
          onChange={(e) => SetName(e.target.value)}
        />
        <br></br>
        <TextField
          label={"Task Content"}
          required
          helperText="Explain task content here to make it more clear for the task members"
          onChange={(e) => SetContent(e.target.value)}
        />
        <br></br>
        <TextField
          required
          type="date"
          helperText="Select a deadline for this task"
          onChange={(e) => SetDeadline(e.target.value)}
        />
        <br></br>
        <TextField
          required
          helperText="Type the user's name then click on the plus icon to add."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          onChange={(e) => SetQueryInput(e.target.value)}
        />
        <div className="model-list-users">
          {!isPending &&
            queryInput &&
            users.map((user) => {
              if (
                user.displayName
                  .toLowerCase()
                  .includes(queryInput.toLowerCase())
              ) {
                return (
                  <UserCard
                    key={user.id}
                    user={user}
                    handleClick={handleAddUser}
                    Icon={<Add />}
                    color={"primary"}
                  />
                );
              } else return null;
            })}
        </div>
        <div
          className="modal-task-members"
          style={{ visibility: taskMembers.length > 0 ? "visible" : "hidden" }}
        >
          <h5>Added Users</h5>
          {taskMembers &&
            taskMembers.map((member) => {
              return (
                <UserCard
                  key={member.id}
                  user={member}
                  handleClick={handleRemoveUser}
                  Icon={<Remove />}
                  color={"secondary"}
                />
              );
            })}
        </div>
        <div className="modal-bottom">
          <Button
            disabled={!name || !content || !deadline || !taskMembers.length > 0}
            variant="contained"
            color="primary"
            onClick={() => handleCreateTask()}
          >
            Create Task
          </Button>
        </div>
      </form>
    </CreateTaskWrapper>
  );
};
export default CreateTask;

const CreateTaskWrapper = styled.div`
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 10px;
  top: 50%;
  left: 50%;
  width: 65%;
  height: 90%;
  border: 1px solid black;
  transform: translate(-50%, -50%);
  background-color: #f5f5f5;
  font-size: 0.8em;

  .modal-top-right {
    positon: absolute;
    margin-left: 90%;
    margin-bottom: 10px;
  }

  .model-list-users {
    height: 30%;
    width: 85%;
    overflow: auto;
    margin: auto;
    background-color: #d5d5d5;
    border-radius: 15px;
  }

  .modal-task-members {
    color: white;
    border-radius: 15px;
    height: 30%;
    width: 85%;
    margin: auto;
    margin-top: 20px;
    overflow: auto;
    background-color: #1f1f1f;
  }
  .modal-bottom {
    margin: 15px;
    padding: 5px;
  }
  input {
    position: relative;
    margin: 10px;
    width: 50vh;
    padding: auto;
  }
`;

import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "@material-ui/core";
import { AuthContext } from "../Auth";
import { firestore } from "../../firebase/firebase";
import FilePreview from "../../components/file-preview/FilePreview";
import styled from "styled-components";

const MessageCard = ({ message }) => {
  let { currentUser } = useContext(AuthContext);
  const [owner, setOwner] = useState(null);
  const [isPending, setPending] = useState(true);

  const d = message.time.toDate();
  const messageTime =
    d.getUTCFullYear() +
    "/" +
    (d.getMonth() + 1) +
    "/" +
    d.getUTCDate() +
    " " +
    (d.getHours() < 10 ? d.getHours() + "0" : d.getHours()) +
    ":" +
    (d.getMinutes() < 10 ? d.getMinutes() + "0" : d.getMinutes());

  useEffect(() => {
    firestore
      .collection("users")
      .doc(message.ownerId)
      .get()
      .then((user) => {
        setOwner({ id: user.id, ...user.data() });
        setPending(false);
      });
    return () => {};
  }, [message]);

  return (
    <div>
      {!isPending && (
        <MessageWrapper
          className={owner.id === currentUser.id ? "right" : "left"}
        >
          <div className="card-header">
            <Avatar
              className="avatar"
              alt={owner.displayName}
              src={owner.photoURL}
            ></Avatar>
            <h3>{owner.displayName}</h3>
            <div className="card-time">{messageTime}</div>
          </div>

          <p>{message.content}</p>
          {message.file && (
            <FilePreview
              file={
                message.file // if message has some files in it
              }
            />
          )}
        </MessageWrapper>
      )}
    </div>
  );
};
export default MessageCard;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  min-width: 500px;

  .card-header {
    position: relative;
    display: inline-flex;
    align-items: center;
    .avatar {
      margin-right: 10px;
    }
  }

  .card-time {
    position: absolute;
    float: right;
    right: 0;
    top: 0;
    font-size: 0.8em;
  }

  &.left,
  &.right {
    font-size: 1em;
    margin: 5px 15px;
    padding: 10px 25px;
    border-radius: 45px;
    min-width: 30%;
    max-width: 80%;
  }
  &.left {
    background-color: #20262a;
    float: left;
    clear: both;
  }
  &.right {
    background: #1a9962;
    float: right;
    clear: both;
  }
`;

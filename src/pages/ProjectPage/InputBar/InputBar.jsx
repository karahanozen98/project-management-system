import React, { useState, useContext } from "react";
import { AuthContext } from "../../../components/Auth";
import firebase from "firebase";
import { firestore, storage } from "../../../firebase/firebase";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import styled from "styled-components";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function InputBar({ projectId }) {
  const { currentUser } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const time = firebase.firestore.FieldValue.serverTimestamp();

  const changeHandler = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    setUploading(true);

    const uploadTask = storage.ref("files").child(file.name).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
      },
      async () => {
        await storage
          .ref("files")
          .child(file.name)
          .getDownloadURL()
          .then((URL) => {
            firestore
              .collection("projects")
              .doc(projectId)
              .collection("chat")
              .add({
                ownerId: currentUser.id,
                content,
                time,
                file: { name: file.name, type: file.type, URL },
              })
              .catch((err) => {
                console.log(err);
              })
              .then(() => cleanUp());
          });
      }
    );
  };

  const cleanUp = () => {
    setUploading(false);
    setFile(null);
    setProgress(null);
    setContent("");
  };

  const handleSend = (e) => {
    e.preventDefault();

    // if there is a file in message upload it to storage
    if (file) {
      handleUpload();
      // if there is no file but there is text in message send it to firestore
    } else if (content !== "") {
      firestore
        .collection("projects")
        .doc(projectId)
        .collection("chat")
        .add({
          ownerId: currentUser.id,
          content,
          time,
        })
        .then(() => cleanUp());
    }
  };

  return (
    <InputBarContainer>
      {isUploading ? (
        <div style={{ width: "100%" }}>
          <LinearProgressWithLabel variant="determinate" value={progress} />
        </div>
      ) : (
        <form
          style={{ width: "100%", height: "100%" }}
          onSubmit={(e) => handleSend(e)}
        >
          <Button
            variant="contained"
            component="label"
            style={{ width: "10%", height: "9vh", opacity: "0.8" }}
            className="upload-btn"
            startIcon={<CloudUploadIcon />}
          >
            {file && file.name.slice(0, 10)}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={changeHandler}
            />
          </Button>
          <TextField
            variant="filled"
            value={content}
            label=" Type your message..."
            style={{
              position: "absolute",
              width: "79%",
              bottom: "0",
              padding: "5px",
            }}
            onChange={(e) => setContent(e.target.value)}
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            disabled={content === "" && !file}
            style={{
              width: "10%",
              height: "9vh",
              position: "absolute",
              right: "0",
            }}
            endIcon={<SendIcon />}
            onClick={handleSend}
            className="send-btn"
          >
            Send
          </Button>
        </form>
      )}
    </InputBarContainer>
  );
}
export default InputBar;

const InputBarContainer = styled.div`
  position: fixed;
  width: 100%;
  display: inline-flex;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
`;

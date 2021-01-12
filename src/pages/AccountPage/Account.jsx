import React, { useContext, useState, useRef } from "react";
import app, { firestore } from "../../firebase/firebase";
import { AuthContext } from "../../components/Auth";
import { Button } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import Footer from "../../components/footer/Footer";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import UploadFile from "../../utils/UploadFile";

function Account() {
  const { currentUser } = useContext(AuthContext); // get Current user information
  const [progress, setProgress] = useState(null);
  var upload = useRef();

  const handleChange = async (e) => {
    if (e.target.files) {
      var file = e.target.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        var downloadURL = await UploadFile(
          file,
          setProgress,
          "account-photos",
          currentUser.id
        );
        firestore
          .collection("users")
          .doc(currentUser.id)
          .update({ photoURL: downloadURL })
          .then(() => window.location.reload());
      }
    }
  };

  return (
    <div>
      <AccountWrapper>
        <div className="account-info">
          {progress ? (
            <CircularProgress variant="determinate" value={progress} />
          ) : (
            <div className="account-avatar">
              <Avatar
                alt={currentUser.displayName}
                src={currentUser.photoURL}
              ></Avatar>
              <Icon
                fontSize="small"
                className="fa fa-plus-circle"
                color="primary"
                onClick={() => upload.click()}
              />

              <input
                type="file"
                ref={(ref) => (upload = ref)}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleChange(e)}
              />
            </div>
          )}
          <div className="account-body">
            <h2>Welcome to your profile, {currentUser.displayName} </h2>
            <p>E-Mail:{currentUser.email}</p>
            <Button variant="outlined" onClick={() => app.auth().signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </AccountWrapper>
      <div className="account-footer">
        <Footer></Footer>
      </div>
    </div>
  );
}
export default Account;

const AccountWrapper = styled.div`
  align-items: center;
  text-align: center;
  min-height: 100vh;

  .account-info {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }

  .account-avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%);

    span {
      position: absolute;
      left: 85%;
      top: 60%;
    }
    span:hover {
      font-size: 1.4em;
    }
  }
  .account-body {
    margin-top: 100px;
  }
  .account-footer {
    position: absolute;

    top: 100%;
  }
`;

import React, { useContext, useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/Auth";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Avatar } from "@material-ui/core";
import styled from "styled-components";

const handleIgnoreNotificaion = (notification) => {
  firestore
    .collection("users")
    .doc(notification.userId)
    .collection("notifications")
    .doc(notification.id)
    .update({ isSeen: true });
};

const handleNotification = (notification) => {
  const ref = firestore.collection("projects").doc(notification.projectId);

  ref
    .get()
    .then((project) => {
      if (project.exists && project.data().isDeleted !== true) {
        ref.collection("members").doc(notification.userId).set({
          id: notification.userId,
          projectId: notification.projectId,
          role: notification.role,
        });
      } else alert("It seems this project has been deleted by it's owners.");
    })
    .then(() => handleIgnoreNotificaion(notification));
};

const LoggedIn = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const ref = React.createRef();

  useEffect(() => {
    const unsub = firestore
      .collection("users")
      .doc(currentUser.id)
      .collection("notifications")
      .where("isSeen", "==", false)
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          let allNotifications = snapshot.docs.map((notification) => ({
            id: notification.id,
            ...notification.data(),
          }));
          setNotifications(allNotifications);
        } else {
          setNotifications([]);
        }
      });

    return () => {
      // Detach notification listener on unmount
      unsub();
    };
  }, [currentUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Nav>
      <h2>Project Management</h2>
      <div className="navbar-right">
        <Link to="/">
          <i className="fas fa-home"></i> Home
        </Link>
        <Link to="/newproject">
          <i className="fas fa-plus"></i> New Project
        </Link>
        <span onClick={handleClick}>
          <i className="fas fa-bell">{notifications.length}</i>
        </span>
        <Menu
          ref={ref}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {notifications.map((notification) => {
            return (
              <MenuItem
                style={{ margin: "5px", padding: "5px" }}
                key={notification.id}
                onClick={handleClose}
              >
                {notification.text}
                <Button
                  style={{ margin: "5px", padding: "5px" }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleNotification(notification)}
                >
                  Accept
                </Button>
                <Button
                  style={{ margin: "5px", padding: "5px" }}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleIgnoreNotificaion(notification)}
                >
                  Ignore
                </Button>
              </MenuItem>
            );
          })}
        </Menu>
        <Link className="avatar" to="/account">
          <Avatar
            alt={currentUser.displayName}
            src={currentUser.photoURL}
          ></Avatar>
          <span>{currentUser.displayName}</span>
        </Link>
      </div>
    </Nav>
  );
};

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <LoggedIn currentUser={currentUser} />;
  }
}
export default Navbar;

const Nav = styled.nav`
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  margin: 0px 0px 10px 0px;
  padding: 20px 0px;
  background-color: #1d1d1d;
  color: #fefefe;

  a {
    text-align: center;
  }
  a:hover {
    background: #4f4f4f;
    border-radius: 5px;
  }
  span {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    padding: 15px 15px;
  }
  span:hover {
    background: #4f4f4f;
    cursor: pointer;
    border-radius: 5px;
  }
  .navbar-right {
    display: flex;
    align-items: center;
    a {
      padding: 10px 20px;
    }
    & > *:not(:last-child) {
      margin-right: 5px;
    }
    .avatar {
      display: flex;
      align-items: center;
      span {
        padding-left: 5px;
      }
    }
  }
`;

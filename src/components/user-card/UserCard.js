import React from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

function UserCard({ user, handleClick, Icon, color, Rest }) {
  return (
    <UserCardWrapper>
      <div className="card-header">
        <Avatar
          className="avatar"
          alt={user.displayName}
          src={user.photoURL}
        ></Avatar>
        <span>{user.displayName}</span>
        <span>{user.email}</span>
        <span>{Rest}</span>
        <IconButton
          aria-label="add"
          size="medium"
          color={color}
          onClick={() => handleClick(user)}
        >
          {Icon}
        </IconButton>
      </div>
    </UserCardWrapper>
  );
}

export default UserCard;

const UserCardWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;

  .card-header {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 10px;
      margin-left: 10px;
    }
    span {
      margin: 10px;
      padding: 10px;
      width: fit-content;
    }
  }
`;

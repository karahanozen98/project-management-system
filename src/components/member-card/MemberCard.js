import React from "react"
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import UserCard from "../user-card/UserCard";
import Remove from "@material-ui/icons/Remove";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        color: "white",
      },
    },
  }));

// Returns a member card
const MemberCard = ({ member, setRole, RemoveMember }) => {
    const classes = useStyles();
  
    const roles = [
      {
        value: "Member",
        label: "Member",
      },
      {
        value: "Contributor",
        label: "Contributor",
      },
      {
        value: "Manager",
        label: "Manager",
      },
      {
        value: "Admin",
        label: "Admin",
      },
    ];
  
    const handleChange = (e) => {
      e.preventDefault();
      setRole(member, e.target.value);
    };
    return (
      <FormControl>
        <UserCard
          key={member.id}
          user={member}
          handleClick={RemoveMember}
          Icon={<Remove />}
          Rest={
            <TextField
              select
              className={classes.root}
              value={member.role}
              onChange={(e) => handleChange(e)}
              helperText="Change the role of the member"
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          }
          color={"secondary"}
        />
      </FormControl>
    );
  };
  export default MemberCard
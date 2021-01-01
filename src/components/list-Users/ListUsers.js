import React from "react";
import UserCard from "../user-card/UserCard";
import Add from "@material-ui/icons/Add";

// List all users as a user card
const ListUsers = ({ queryList, AddMember }) => {
  return queryList.map((user) => {
    user.role = "Member";
    return (
      <UserCard
        key={user.id}
        user={user}
        handleClick={AddMember}
        Icon={<Add />}
        color={"primary"}
      />
    );
  });
};
//##############   SİLİNECEK  #########
// Returns a user card
// const UserCard = ({ user, AddMember }) => {
//   user.role = "Member";
//   return (
//     <form style={{ display: "inline-flex", margin: "5px", padding: "5px" }}>
//       <span>
//         <Avatar alt={user.displayName} src={user.photoURL}></Avatar>
//         <span>{user.displayName}</span>
//         <span>{user.email}</span>

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => AddMember(user)}
//         >
//           Add
//         </Button>
//       </span>
//     </form>
//   );
// };
export default ListUsers;

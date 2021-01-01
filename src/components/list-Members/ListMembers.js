import React from "react";
import MemberCard from "../../components/member-card/MemberCard"


// List all members as a member card
const ListMembers = ({ members, setRole, RemoveMember }) => {
  return (
    <div>
      <h5>Edit Members</h5>
      {members.map((member) => {
        return (
          <MemberCard
            key={member.id}
            member={member}
            setRole={setRole}
            RemoveMember={RemoveMember}
          />
        );
      })}
    </div>
  );
};
export default ListMembers;

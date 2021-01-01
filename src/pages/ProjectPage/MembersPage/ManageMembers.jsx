import React, { useState, useEffect } from "react";
import { firestore } from "../../../firebase/firebase";
import MemberCard from "../../../components/member-card/MemberCard";
import PreLoader from "../../../shared/components/preloader/preloader";

const ListMember = ({ projectId, member }) => {
  const [user, SetUser] = useState(null);
  const ref = firestore
    .collection("projects")
    .doc(projectId)
    .collection("members");

  useEffect(() => {
    firestore
      .collection("users")
      .doc(member.id)
      .get()
      .then((user) => {
        if (user.exists) {
          const tmp = { id: user.id, ...user.data(), role: member.role };
          SetUser(tmp);
        }
      });
  }, [member]);

  const RemoveMember = (member) => {
    var r = window.confirm(
      "Warning!\nMember will be exclude from this project"
    );
    if (r) {
      ref
        .doc(member.id)
        .delete()
        .catch((err) => console.log(err))
        .then(() => SetUser(null));
    }
  };
  const changeRole = (member, role) => {
    var r = window.confirm(
      "Warning!\n You are changing a member's role. Be carefull about the permissions you give them."
    );
    if (r) {
      ref
        .doc(member.id)
        .update({ role })
        .catch((err) => console.log(err))
        .then(() => {
          const tmp = { ...user };
          tmp.role = role;
          SetUser(tmp);
        });
    }
  };

  const cantChange = () => {
    alert("You can't change the attributes of an ADMIN!");
  };

  return (
    user && (
      <MemberCard
        key={user.id}
        member={user}
        setRole={user.role === "Admin" ? cantChange : changeRole}
        RemoveMember={user.role === "Admin" ? cantChange : RemoveMember}
      />
    )
  );
};

function ManageMembers({ projectId }) {
  const [members, setMembers] = useState([]);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("members")
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          const allmembers = snapshot.docs.map((member) => ({
            id: member.id,
            ...member.data(),
          }));
          setMembers(allmembers);
          setPending(false);
        } else {
          setPending(false);
        }
      });

    return () => {};
  }, [projectId]);

  return (
    <div style={{ textAlign: "center" }}>
      {isPending ? (
        <PreLoader />
      ) : (
        <div
          style={{
            backgroundColor: "#1f1f1f",
            color: "white",
            textAlign: "center",
            alignItems: "center",
            width: "80%",
            borderRadius: "20px",
            margin: "auto",
            marginTop: "20px",
            fontSize: "0.9",
          }}
        >
          {members.map((member) => {
            return (
              <ListMember
                projectId={projectId}
                key={member.id}
                member={member}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManageMembers;

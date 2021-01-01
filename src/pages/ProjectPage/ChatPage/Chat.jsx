import React, { useState, useEffect } from "react";
import InputBar from "../InputBar/InputBar";
import { firestore } from "../../../firebase/firebase";
import MessageCard from "../../../components/message-card/MessageCard";

function Chat({ projectId, role }) {
  const [messages, setMessages] = useState([]);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const unsub = firestore
      .collection("projects")
      .doc(projectId)
      .collection("chat")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const allmessages = snapshot.docs.map((message) => ({
            id: message.id,
            ...message.data(),
          }));
          setMessages(allmessages);
          setPending(false);
        }
      });
    return () => unsub();
  }, [projectId]);

  return (
    <div>
      <div>
        {!isPending &&
          messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
      </div>
      {role !== "Member" && <InputBar projectId={projectId} />}
    </div>
  );
}

export default Chat;

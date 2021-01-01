import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { firestore } from "../../../firebase/firebase";
import PreLoader from "../../../shared/components/preloader/preloader";
import styled from "styled-components";

function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);
  const [isPending, setPending] = useState(true);

  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    firestore
      .collection("projects")
      .doc(projectId)
      .update({ isDeleted: true })
      .then(() => {
        history.replace("/");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    firestore
      .collection("projects")
      .doc(projectId)
      .get()
      .then((project) => {
        setProject({ id: project.id, ...project.data() });
        setPending(false);
      })
      .catch((err) => console.log(err));
  }, [projectId]);

  return (
    <Details>
      {isPending ? (
        <PreLoader />
      ) : (
        <div>
          <h3>{project.name}</h3>
          <p>{project.content}</p>
          <button onClick={(e) => handleClick(e)}>Delete Project</button>
        </div>
      )}
    </Details>
  );
}

const Details = styled.div`
  text-align: center;
`;

export default ProjectDetails;

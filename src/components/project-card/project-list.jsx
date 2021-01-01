import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

function ProjectCard({ project }) {
  let history = useHistory();

  return (
    <div>
      {project && (
        <HomeWrapper>
          <div className="project-item">
            <div className="project-info">
              <div className="info-item">
                <h3>{project.name}</h3>
              </div>
              <div className="info-item">
                <span>{project.deadline}</span>
              </div>
              <div className="info-item">
                <span>{"Project Responsiblity: " + project.role}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={() => history.push("/project:" + project.id)}
          >
            Go Details
          </Button>
        </HomeWrapper>
      )}
    </div>
  );
}

export default ProjectCard;
const HomeWrapper = styled.div`
  position: relative;
  width: 400px;
  border: 5px solid #638ca3;
  border-radius: 10px;
  padding: 50px 10px;
  margin: 10px 0;
  text-align: center;
  color: #ddd;
  background-color: #363945;
  &:hover& {
    transition: all 0.5s ease;
    transform: scale(1.05);
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  &:hover&:after {
    opacity: 1;
  }

  * {
    z-index: 11;
  }

  .project-item {
    .project-info {
      display: flex;
      flex-direction: column;
      padding: 10px;
      .info-item {
        margin: 10px 0;
        h3 {
          color: #fff;
          font-weight: 500;
        }
        span {
          color: #fff;
          font-weight: 500;
        }
      }
    }
  }
  button {
    border: 2px solid #f1f1f1;
    color: #fff;
    &:hover {
      background-color: #7badca;
      color: #ddd;
    }
  }
`;

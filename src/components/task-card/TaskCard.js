import React from "react";
import styled from "styled-components";

function TaskCard({ task, rest }) {
  return (
    <TaskCardWrapper>
      <h3>{task.name}</h3>
      <details>
        <summary>{"Content"}</summary>
        <span>{task.content}</span>
      </details>
      <p>{task.deadline}</p>
      <div className={task.isCompleted ? "completed" : "notcompleted"}>
        {task.isCompleted ? <p>Task completed ✅</p> : <p>Still Waiting...</p>}
      </div>
      {rest && rest}
    </TaskCardWrapper>
  );
}
export default TaskCard;

const TaskCardWrapper = styled.div`
  text-align: center;
  height: 300px;
  width: 25%;
  overflow: auto;
  border: 5px solid #638ca3;
  border-radius: 10px;
  color: #ddd;
  background-color: #242730;
  margin: 15px;
  padding: 15px;

  &:hover& {
    transition: all 0.5s ease;
    transform: scale(1.05);
  }

  span {
    max-width: 100%;
    word-wrap: break-word;
  }
  .completed {
    color: #40ff00;
  }
  .notcompleted {
    color: red;
  }
`;

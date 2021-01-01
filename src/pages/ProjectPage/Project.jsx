import React from "react";
import { firestore } from "../../firebase/firebase";
import Chat from "./ChatPage/Chat";
import ProjectDetails from "./DetailsPage/ProjectDetails";
import Members from "./MembersPage/ManageMembers";
import ManageTasks from "./ManageTasks/ManageTasks.jsx";
import MyTasks from "./MyTasks/MyTasks";
import { AuthContext } from "../../components/Auth";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import PreLoader from "../../shared/components/preloader/preloader";

class Project extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super();
    this.state = {
      projectId: window.location.pathname.split("project:")[1],
      SelectedPage: null,
      role: "Member",
      isPending: true,
    };
  }

  componentDidMount() {
    let { currentUser } = this.context;
    firestore
      .collection("projects")
      .doc(window.location.pathname.split(":")[1])
      .get()
      .then((project) => {
        if (project.exists && project.data().isDeleted !== true) {
          project.ref
            .collection("members")
            .doc(currentUser.id)
            .get()
            .then((doc) => {
              if (doc.exists) {
                this.setState({
                  SelectedPage: (
                    <Chat
                      projectId={this.state.projectId}
                      role={doc.data().role}
                    />
                  ),
                  role: doc.data().role,
                  isPending: false,
                });
              } else {
                alert("You are not a members of this project");
                this.props.history.push("/");
              }
            });
        } else {
          this.props.history.push("/");
        }
      });
  }

  changeSelectedPage = (Page) => {
    this.setState({
      SelectedPage: Page,
    });
  };

  render() {
    return this.state.isPending ? (
      <PreLoader />
    ) : (
      <ProjectWrapper>
        <div className="form-selector">
          {this.state.role === "Admin" && (
            <Button
              variant="outlined"
              onClick={() =>
                this.changeSelectedPage(
                  <ProjectDetails projectId={this.state.projectId} />
                )
              }
            >
              Edit Project Details
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() =>
              this.changeSelectedPage(
                <Chat projectId={this.state.projectId} role={this.state.role} />
              )
            }
          >
            Chat
          </Button>
          {(this.state.role === "Admin" || this.state.role === "Manager") && (
            <Button
              variant="outlined"
              id="members"
              onClick={() =>
                this.changeSelectedPage(
                  <Members projectId={this.state.projectId} />
                )
              }
            >
              Edit Members
            </Button>
          )}
          {(this.state.role === "Admin" || this.state.role === "Manager") && (
            <Button
              variant="outlined"
              id="managetasks"
              onClick={() =>
                this.changeSelectedPage(
                  <ManageTasks projectId={this.state.projectId} />
                )
              }
            >
              Manage Tasks
            </Button>
          )}
          {
            <Button
              variant="outlined"
              id="members"
              onClick={() =>
                this.changeSelectedPage(
                  <MyTasks projectId={this.state.projectId} />
                )
              }
            >
              My Tasks
            </Button>
          }
        </div>
        {this.state.SelectedPage && this.state.SelectedPage}
      </ProjectWrapper>
    );
  }
}

export default Project;

const ProjectWrapper = styled.div`
  .form-selector {
    text-align: center;
  }
`;

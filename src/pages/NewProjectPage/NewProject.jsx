import React from "react";
import { firestore } from "../../firebase/firebase";
import { Button } from "@material-ui/core";
import { AuthContext } from "../../components/Auth";
import { TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import ListUsers from "./../../components/list-Users/ListUsers";
import ListMembers from "./../../components/list-Members/ListMembers";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Footer from "../../components/footer/Footer";
import styled from "styled-components";

class NewProject extends React.Component {
  static contextType = AuthContext;

  constructor() {
    super();
    this.state = {
      name: "",
      content: "",
      deadline: "",
      members: [],
      queryInput: "",
      queryList: [],
      currentUser: null,
    };
  }

  componentDidMount() {
    let { currentUser } = this.context;
    this.setState({ currentUser: currentUser });
  }

  handleQuery = (e) => {
    let tmpQuery = [];
    if (this.state.queryInput !== "") {
      firestore
        .collection("users")
        .orderBy("displayName")
        .startAt(this.state.queryInput)
        .endAt(this.state.queryInput + "\uf8ff")
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            tmpQuery = snapshot.docs.map((user) => ({
              id: user.id,
              ...user.data(),
            }));
          } else {
            tmpQuery = [];
          }
        })
        .then(() => this.setState({ queryList: tmpQuery }))
        .catch((err) => console.log(err));
    } else {
      this.setState({ queryList: [] });
    }
  };

  AddMember = (user) => {
    var tmp = this.state.members;
    if (!tmp.find((u) => u.id === user.id)) {
      tmp.push(user);
      this.setState({ members: tmp });
    } else {
      alert("You already added the user!");
    }
  };
  RemoveMember = (user) => {
    let tmp = this.state.members;
    if (tmp.find((u) => u.id === user.id)) {
      tmp.pop(user);
      this.setState({ members: tmp });
    }
  };

  setRole = (member, role) => {
    let tmpMembers = this.state.members;
    const index = tmpMembers.findIndex((m) => m === member);
    if (index !== -1) {
      const tmpMember = { ...tmpMembers[index], role };
      tmpMembers[index] = tmpMember;
      this.setState({ members: tmpMembers });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const ref = firestore.collection("projects");

    ref
      .add({
        name: this.state.name,
        content: this.state.content,
        deadline: this.state.deadline,
      })
      .then((doc) => {
        ref
          .doc(doc.id)
          .collection("members")
          .doc(this.state.currentUser.id)
          .set({
            id: this.state.currentUser.id,
            projectId: doc.id,
            role: "Admin",
          })
          .then(() => {
            if (this.state.members.length > 0) {
              this.state.members.forEach((member) => {
                firestore
                  .collection("users")
                  .doc(member.id)
                  .collection("notifications")
                  .add({
                    type: "project-invite",
                    text:
                      this.state.currentUser.displayName +
                      " invited you to a project called " +
                      this.state.name,
                    userId: member.id,
                    role: member.role,
                    projectId: doc.id,
                    isSeen: false,
                  })
                  .catch((err) => console.log(err));
              });
            }
          })
          .then(() => this.props.history.push("/project:" + doc.id))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <NewProjectWrapper>
          <FormControl onSubmit={this.handleSubmit}>
            <TextField
              label="Project Name"
              required
              helperText="Name your project to find it later"
              onInput={(e) => this.setState({ name: e.target.value })}
            />
            <br></br>
            <TextField
              label="Project Content"
              required
              multiline
              helperText="Explain project content and details for other members"
              onInput={(e) => this.setState({ content: e.target.value })}
            />
            <br></br>
            <TextField
              name="deadline"
              required
              type="date"
              helperText="Select a deadline for this projects"
              value={this.state.deadline}
              onChange={(e) => this.setState({ deadline: e.target.value })}
            />
            <br></br>
            <TextField
              id="members"
              label="Search for users"
              helperText="Search people with their names, you can also add members later"
              required
              value={this.state.queryInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                this.setState({ queryInput: e.target.value }, () =>
                  this.handleQuery()
                )
              }
            />
            <br></br>
            <div className="new-project-list-users">
              <ListUsers
                queryList={this.state.queryList}
                AddMember={this.AddMember}
              />
            </div>
            <div className="new-project-list-members">
              {this.state.members.length > 0 && (
                <ListMembers
                  members={this.state.members}
                  setRole={this.setRole}
                  RemoveMember={this.RemoveMember}
                />
              )}
            </div>
            <br></br>
            <Button
              variant="contained"
              disabled={
                !this.state.name || !this.state.content || !this.state.deadline
              }
              color="primary"
              type="submit"
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </FormControl>
        </NewProjectWrapper>
        <Footer></Footer>
      </div>
    );
  }
}
export default NewProject;

const NewProjectWrapper = styled.div`
  text-align:center;
  align-items;center;
  margin:10px;
  min-height:100vh;
  .new-project-list-users{
    font-size:0.9em;
    text-align: center;
    border-radius:10px;
    width: 100vh;
    max-height:400px;
    margin: 10px;
    background-color: #d5d5d5;
    overflow: auto;

  }
  .new-project-list-members{
    font-size:0.8em;
    color: White;
    border-radius:10px;
    text-align: center;
    width: 100vh;
    height: 55%;
    margin: 0px;
    background-color: #1f1f1f;
    overflow: auto;

  }
`;

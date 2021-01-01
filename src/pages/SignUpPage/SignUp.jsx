import React, { useState } from "react";
import { withRouter } from "react-router";
import app, { firestore } from "../../firebase/firebase";
import Button from "@material-ui/core/Button";
import bgImg from "../../shared/assets/images/login-bg-lg.jpg";
import styled from "styled-components";
import { TextField } from "@material-ui/core";

const SignUp = ({ history }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (event) => {
    event.preventDefault();
    try {
      app
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
          firestore
            .collection("users")
            .doc(cred.user.uid)
            .set({
              email: cred.user.email,
              displayName: firstName + " " + lastName,
              photoURL: "",
            });
        })
        .then(() => history.push("/"))
        .catch((error) => alert(error));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SignupContainer>
      <form onSubmit={handleSignUp}>
        <h1>Sign up</h1>
        <div className="inputs">
          <TextField
            id="firstname"
            label="First Name"
            required
            name="firstname"
            onInput={(e) => setFirstName(e.target.value)}
          />
          <TextField
            id="lastname"
            label="Last Name"
            required
            name="lastname"
            onInput={(e) => setLastName(e.target.value)}
          />
          <TextField
            id="email"
            label="Email"
            required
            name="email"
            onInput={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            required
            type="password"
            name="password"
            onInput={(e) => setPassword(e.target.value)}
          />

          <Button variant="outlined" size="large" type="submit">
            Sign Up
          </Button>
        </div>
        <div className="login">
          Already have an account?{" "}
          <Button
            variant="outlined"
            size="small"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </div>
      </form>
    </SignupContainer>
  );
};
export default withRouter(SignUp);

const SignupContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: url(${bgImg}) no-repeat no-repeat;
  background-size: cover;
  & > form {
    color: #2d6187;
    margin-top: 10rem;
    padding: 1.5rem 5.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }

  button {
    padding: 5px 20px;
    &:hover {
      background-color: #2d6187;
      color: #fff;
    }
  }

  .inputs {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    & > * {
      padding: 10px 0;
    }
  }
  .login {
    display: flex;
    align-items: center;
    & > span {
      opacity: 0.7;
    }
    & > button {
      padding: 5px 10px;
      margin-left: 5px;
    }
  }
`;

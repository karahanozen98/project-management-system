import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../firebase/firebase";
import { AuthContext } from "../../components/Auth";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import bgImg from "../../shared/assets/images/login-bg-lg.jpg";
import { TextField } from "@material-ui/core";

function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(email, password);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [email, password, history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
		<LoginContainer>
			<form onSubmit={handleLogin}>
				<h1>Login</h1>
				<div className='inputs'>
					<TextField
						id='email'
						label='Email'
						required
						name='email'
						type='email'
						onInput={(e) => setEmail(e.target.value)}
					/>
					<TextField
						id='password'
						label='Password'
						required
						name='password'
						type='password'
						onInput={(e) => setPassword(e.target.value)}
					/>
					<Button variant='outlined' type='submit'>
						Log in
					</Button>
				</div>

				<div className='sign-up'>
					<span>Need an account?</span>
					<Button
						variant='outlined'
						size='small'
						onClick={() => history.push('/signup')}
					>
						Sign Up
					</Button>
				</div>
			</form>
		</LoginContainer>
	);
}

export default withRouter(Login);

const LoginContainer = styled.div`
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
    padding: 1.5rem 4.5rem;
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
  .sign-up {
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

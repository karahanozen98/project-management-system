import React, { useEffect, useState } from 'react';
import app, { firestore } from '../firebase/firebase.js';
import { CircularProgress } from '@material-ui/core';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [pending, setPending] = useState(true);

  useEffect(() => {
    const unsub = app.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setPending(true);
        await firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            setCurrentUser({ id: doc.id, ...doc.data() });
            setPending(false);
          });
      } else {
        setCurrentUser(null);
        setPending(false);
      }
    });
    return () => {
      unsub();
      setPending(true);
    };
  }, []);

	if (pending) {
		return (
			<center
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<CircularProgress size='5rem' />
			</center>
		);
	}
	return (
		<AuthContext.Provider
			value={{
				currentUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

/*
import React, { useEffect, useState } from "react";
import app, { firestore } from "./firebase.js";
import { CircularProgress } from "@material-ui/core";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  //  AWAIT KULLAN !!!!!!!! USERS KOLEKSİYONUNDAKİ VERİ ÇEKİLMEDEN KOD DEVAM ETMESİN
  useEffect(() => {
    const unsub = app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            setCurrentUser({ id: doc.id, ...doc.data() });
  
          });
      } 
    });
    return () => {
      unsub();
    };
  }, []);

  if (pending) {
    return (
      <center
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress size="5rem" />
      </center>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


*/

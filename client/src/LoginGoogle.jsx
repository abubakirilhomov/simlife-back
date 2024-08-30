import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LoginGoogle = () => {
    const handleGoogleLogin = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                return result.user.getIdToken(); // Get the ID token
            })
            .then((token) => {
                return fetch('http://localhost:5000/api/login-google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
            })
            .then(response => response.json())
            .then(data => {
                if (data.uid) {
                    console.log("Sign-in successful", data);
                } else {
                    console.error("Sign-in failed:", data.error);
                }
            })
            .catch(error => console.error("Sign-in failed:", error));
    };

    return (
        <button onClick={handleGoogleLogin}>
            Sign in with Google
        </button>
    );
};

export default LoginGoogle;

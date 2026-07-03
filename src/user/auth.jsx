import React from "react";
import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <>
            
            <div className="auth-container">
                <div className="form-switch">
                    <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                    <p style={{ marginTop: '8px' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={toggleForm}>
                            {isLogin ? "Register here" : "Login here"}
                        </span>
                    </p>
                </div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </>
    );
};

export default Auth;

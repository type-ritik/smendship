import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { SIGNUP_NOW } from "../../services/AuthService";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";

function SignupComponent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { data, loading, error }] = useMutation(SIGNUP_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(signInStart());
      console.log("Loading...");
    }
    if (error) {
      dispatch(signInFailure(error.message));
      toast.error("Signup Failed");
    }
    if (data) {
      dispatch(signInSuccess(data.signup));
      window.localStorage.setItem("token", data.login.token);
    }
  }, [loading, error, data, dispatch]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup({
      variables: {
        name,
        email,
        password,
      },
    });

    navigate("/home?signup=success");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Toaster />
      <div className="w-120 bg-amber-50 gap-2 border rounded shadow-xs shadow-gray-900!">
        <div className="w-full p-5! flex flex-col gap-2!">
          <h2 className="w-full flex text-base font-semibold justify-center items-center border-b">
            Signup here!
          </h2>
          <br />
          <form className="s_form" onSubmit={handleSignup}>
            <div className="w-full flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
              />
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
              />
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter strong password"
              />
            </div>
            <button className="s_sumbit" type="submit">
              Signup
            </button>
          </form>
          <div className="w-full flex justify-center cursor-pointer">
            <span
              className="text-blue-600"
              onClick={() => navigate("/auth/login")}
            >
              Already have an account?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;

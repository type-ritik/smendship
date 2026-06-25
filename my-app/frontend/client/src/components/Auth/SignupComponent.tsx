import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { SIGNUP_NOW } from "../../services/AuthService";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import VerifyOTPComponenet from "../helperComponent/Card/VerifyOTPComponenet";
import GoogleAuthComponent from "./GoogleAuthComponent";
import GithubAuthComponent from "./GithubAuthComponent";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart } from "../../redux/user/userSlice";

function SignupComponent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [signup, { data, loading, error }] = useMutation(SIGNUP_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(signInStart());
    }
    if (error) {
      dispatch(signInFailure(error.message));
    }
    if (data) {
      setIsVerifyingOTP(true);
      window.localStorage.setItem("email", email);
    }
  }, [loading, error, data, email, dispatch]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup({
      variables: {
        name,
        email,
        password,
      },
    });
  };

  return (
    <div
      className={`w-full relative h-screen flex justify-center items-center`}
    >
      <Toaster />
      {isVerifyingOTP && (
        <VerifyOTPComponenet setFloatComponent={setIsVerifyingOTP} />
      )}
      <div className="w-120 bg-amber-50 gap-2 rounded-xl shadow-sm shadow-gray-900">
        <div className="w-full p-5! flex flex-col">
          <h2 className="w-full flex text-base font-semibold justify-center items-center border-b">
            Signup here!
          </h2>
          <br />
          <form className="s_form gap-5!" onSubmit={handleSignup}>
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
            <button
              className="s_sumbit bg-violet-600! hover:bg-violet-800!"
              type="submit"
            >
              Create new account
            </button>
          </form>
          <div className="w-full py-5! flex justify-center cursor-pointer text-sm">
            <span
              className="text-blue-500 hover:text-blue-600"
              onClick={() => navigate("/auth/login")}
            >
              Already have an account?
            </span>
          </div>
          <div className="w-full h-10 flex gap-5 justify-center">
            <GoogleAuthComponent />
            <span className="border flex justify-center items-center border-gray-500 rounded-full"></span>
            <GithubAuthComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;

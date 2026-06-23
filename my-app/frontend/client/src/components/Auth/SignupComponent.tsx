import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { SIGNUP_NOW } from "../../services/AuthService";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import VerifyOTPComponenet from "../helperComponent/Card/VerifyOTPComponenet";

function SignupComponent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [signup, { data, loading, error }] = useMutation(SIGNUP_NOW);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log("Loading...");
    }
    if (error) {
      toast.error("Signup Failed");
    }
    if (data) {
      setIsVerifyingOTP(true);
      window.localStorage.setItem("email", email);
    }
  }, [loading, error, data, email]);

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
        <div className="w-full p-5! flex flex-col gap-5">
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
          <div className="w-full flex justify-center cursor-pointer text-sm">
            <span
              className="text-blue-500 hover:text-blue-600"
              onClick={() => navigate("/auth/login")}
            >
              Already have an account?
            </span>
          </div>
          <div className="w-full flex gap-5 justify-between">
            <div
              id="google-signup"
              className="w-full px-5! py-3! rounded-sm flex items-center gap-2 justify-center text-sm bg-white shadow-sm shadow-black cursor-pointer"
            >
              Continue with Google
              <FcGoogle />
            </div>
            <div
              id="github-signup"
              className="w-full px-5! py-3! rounded-sm flex items-center gap-2 justify-center text-sm bg-white shadow-sm shadow-black cursor-pointer"
            >
              Continue with Github
              <ImGithub />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;

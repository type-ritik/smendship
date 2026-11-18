import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { SIGNUP_NOW } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import VerifyOTPComponenet from "../helperComponent/Card/VerifyOTPComponenet";
import GoogleAuthComponent from "./GoogleAuthComponent";
import GithubAuthComponent from "./GithubAuthComponent";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart } from "../../redux/user/userSlice";
import { AuthShell, Field, SocialRow, SubmitButton } from "./AuthUI";

function SignupComponent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [signup, { loading }] = useMutation(SIGNUP_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      await signup({ variables: { input: { name, email, password } } });
      window.localStorage.setItem("email", email);
      setIsVerifyingOTP(true);
    } catch (err) {
      const message = (err as Error).message || "Sign up failed. Try again.";
      dispatch(signInFailure(message));
      toast.error(message, { id: "signup" });
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join in a minute and start connecting."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="font-medium text-teal-700 hover:underline"
          >
            Log in
          </button>
        </>
      }
    >
      <Toaster />
      {isVerifyingOTP && (
        <VerifyOTPComponenet setFloatComponent={setIsVerifyingOTP} />
      )}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <Field
          id="name"
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Your full name"
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Choose a strong password"
          autoComplete="new-password"
        />
        <SubmitButton type="submit" loading={loading}>
          {loading ? "Creating account…" : "Create account"}
        </SubmitButton>
      </form>

      <SocialRow>
        <GoogleAuthComponent />
        <GithubAuthComponent />
      </SocialRow>
    </AuthShell>
  );
}

export default SignupComponent;

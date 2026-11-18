import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN_NOW } from "../../services/AuthService";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../redux/user/userSlice";
import GoogleAuthComponent from "./GoogleAuthComponent";
import GithubAuthComponent from "./GithubAuthComponent";
import { AuthShell, Field, SocialRow, SubmitButton } from "./AuthUI";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading }] = useMutation(LOGIN_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Everything happens in the handler: no effect re-runs, and we only
  // navigate when the login actually succeeded.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data } = await login({ variables: { email, password } });
      dispatch(loginSuccess(data.loginUpUser));

      window.localStorage.setItem("token", data.loginUpUser.token);
      toast.success(data.login.message, { id: "login" });
      navigate("/?login=success");
    } catch (err) {
      const message = (err as Error).message || "Login failed. Try again.";
      dispatch(loginFailure(message));
      toast.error(message, { id: "login" });
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your network."
      footer={
        <>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="font-medium text-teal-700 hover:underline"
          >
            Sign up
          </button>
        </>
      }
    >
      <Toaster />
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          placeholder="Your password"
          autoComplete="current-password"
        />
        <SubmitButton type="submit" loading={loading}>
          {loading ? "Logging in…" : "Log in"}
        </SubmitButton>
      </form>

      <SocialRow>
        <GoogleAuthComponent />
        <GithubAuthComponent />
      </SocialRow>
    </AuthShell>
  );
}

export default LoginComponent;

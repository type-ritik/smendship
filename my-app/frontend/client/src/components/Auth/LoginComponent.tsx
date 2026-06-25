import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN_NOW } from "../../services/AuthService";
import { useEffect, useState } from "react";
import "./Login.css";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../redux/user/userSlice";
import GoogleAuthComponent from "./GoogleAuthComponent";
import GithubAuthComponent from "./GithubAuthComponent";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(loginStart());
      toast.loading("Validating credentials");
    }
    if (error) {
      dispatch(loginFailure(error.message));
      toast.dismiss();
      toast.error(error.message);
    }
    if (data) {
      dispatch(loginSuccess(data.login));
      toast.dismiss();
      toast.success(data.login.message);
      window.localStorage.setItem("token", data.login.token);
    }
  }, [loading, error, data, dispatch]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement login logic here, e.g., call the LOGIN_NOW mutation with email and password

    await login({
      variables: {
        email,
        password,
      },
    });

    navigate("/?login=success");
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <Toaster />
        <div className="w-120 bg-amber-50 rounded-xl shadow-sm shadow-gray-900">
          <div className="w-full p-5! flex flex-col">
            <h2 className="w-full flex text-base font-semibold justify-center items-center border-b">
              Login here!
            </h2>
            <br />
            <form onSubmit={handleLogin}>
              <div className="w-full flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // value={this.state.email}
                  // onChange={this.handleChange}
                  className="outline-none"
                  placeholder="example@hotmail.com"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*********"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-500! hover:bg-indigo-800!"
              >
                Login
              </button>
            </form>
            <div className="w-full flex justify-center cursor-pointer">
              <span
                className="text-blue-500 text-sm hover:text-blue-600 py-5!"
                onClick={() => navigate("/auth/signup")}
              >
                Don't have an account?
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
    </>
  );
}

export default LoginComponent;

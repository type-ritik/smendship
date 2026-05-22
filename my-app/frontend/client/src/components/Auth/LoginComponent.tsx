import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN_NOW } from "../../services/AuthService";
import { useEffect, useState } from "react";
import "./Login.css";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/user/userSlice";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_NOW);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(loginStart());
      console.log("Loading");
    }
    if (error) {
      dispatch(loginFailure(error.message));
      toast.error("Login Error");
    }
    if (data) {
      dispatch(loginSuccess(data.login));
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
        <div className="w-120 bg-amber-50 gap-2 border rounded shadow-xs shadow-gray-900!">
          <div className="w-full p-5! flex flex-col gap-2!">
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
              <button type="submit">login</button>
            </form>
            <div className="w-full flex justify-center cursor-pointer">
              <span
                className="text-blue-600"
                onClick={() => navigate("/auth/signup")}
              >
                Don't have an account?
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginComponent;

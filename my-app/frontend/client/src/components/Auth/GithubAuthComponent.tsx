import { useMutation } from "@apollo/client";
import { useEffect, useRef } from "react";
import { ImGithub } from "react-icons/im";
import { GITHUB_AUTH_TOKEN_EXCHANGE } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../../redux/user/userSlice";
import { socialButtonClass } from "./AuthUI";

function GithubAuthComponent() {
  const hasCalled = useRef(false);
  const [githubAuthExchangeToken, { data, loading, error }] = useMutation(
    GITHUB_AUTH_TOKEN_EXCHANGE,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGithubLogin = () => {
    window.location.href = import.meta.env.VITE_GITHUB_REDIRED_URI;
  };

  useEffect(() => {
    async function exchangeToken() {
      const code = new URLSearchParams(window.location.search).get("code");

      // No ?code= just means the page was opened normally, not an error.
      if (!code || hasCalled.current) return;
      hasCalled.current = true;

      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        await githubAuthExchangeToken({ variables: { token: code } });
      } catch (err) {
        dispatch(signInFailure((err as Error)?.message || "An error occurred"));
      }
    }

    exchangeToken();
  }, [githubAuthExchangeToken, dispatch]);

  useEffect(() => {
    if (error) dispatch(signInFailure(error.message));

    if (data) {
      dispatch(signInSuccess(data.githubAuthExchangeToken));
      window.localStorage.setItem("token", data.githubAuthExchangeToken.token);
      navigate("/?auth=success");
    }
  }, [data, error, dispatch, navigate]);

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      disabled={loading}
      className={`${socialButtonClass} disabled:opacity-60`}
    >
      <ImGithub size={18} />
      GitHub
    </button>
  );
}

export default GithubAuthComponent;

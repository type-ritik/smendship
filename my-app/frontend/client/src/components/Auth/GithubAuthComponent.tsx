import { useMutation } from "@apollo/client";
import { useEffect, useRef } from "react";
import { ImGithub } from "react-icons/im";
import { GITHUB_AUTH_TOKEN_EXCHANGE } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../../redux/user/userSlice";

function GithubAuthComponent() {
  const hasCalled = useRef(false);
  const [githubAuthExchangeToken, { data, error }] = useMutation(
    GITHUB_AUTH_TOKEN_EXCHANGE,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGithubLogin = async () => {
    const targetUrl = import.meta.env.VITE_GITHUB_REDIRED_URI;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    async function exchangeToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        dispatch(signInFailure("No code found in URL parameters."));
        return;
      }

      if (hasCalled.current) return;
      hasCalled.current = true;

      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        await githubAuthExchangeToken({
          variables: {
            token: code,
          },
        });
      } catch (error) {
        dispatch(
          signInFailure((error as Error)?.message || "An error occurred"),
        );
      }
    }

    exchangeToken();
  }, [githubAuthExchangeToken, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(signInFailure(error.message));
    }

    if (data) {
      dispatch(signInSuccess(data.githubAuthExchangeToken));
      // console.log("Github token exchange successful:", data);
      window.localStorage.setItem("token", data.githubAuthExchangeToken.token);
      navigate("/?auth=success");
    }
  }, [data, error, dispatch, navigate]);
  return (
    <>
      <div
        id="github-signup"
        onClick={() => handleGithubLogin()}
        className="min-w-2/5 flex-1 rounded-sm flex items-center gap-2 justify-center text-sm bg-white text-gray-700 border border-gray-300 cursor-pointer"
      >
        <ImGithub size={20} />
        Sign in with Github
      </div>
    </>
  );
}

export default GithubAuthComponent;

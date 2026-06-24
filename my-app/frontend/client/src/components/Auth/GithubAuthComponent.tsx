import { useMutation } from "@apollo/client";
import { useEffect, useRef } from "react";
import { ImGithub } from "react-icons/im";
import { GITHUB_AUTH_TOKEN_EXCHANGE } from "../../services/AuthService";

function GithubAuthComponent() {
  const hasCalled = useRef(false);
  const [githubAuthExchangeToken, { data, error }] = useMutation(
    GITHUB_AUTH_TOKEN_EXCHANGE,
  );

  const handleGithubLogin = async () => {
    const clientId = import.meta.env.VITE_GITHUB_API_CLIENT_ID;
    const redirectUri = "http://localhost:5173/auth/signup";
    const targetUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${clientId}&redirect_uri=${redirectUri}`;

    window.location.href = targetUrl;
  };

  useEffect(() => {
    async function exchangeToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.log("No code found in URL parameters.");
        return;
      }

      if (hasCalled.current) return;
      hasCalled.current = true;

      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const res = await githubAuthExchangeToken({
          variables: {
            token: code,
          },
        });
        console.log("Res: ", res);
      } catch (err) {
        console.error("Server exchange failed: ", err);
      }
    }

    exchangeToken();
  }, [githubAuthExchangeToken]);

  useEffect(() => {
    if (error) {
      console.log("Github Error: ", error.message);
    }

    if (data) {
      console.log("Github token exchange successful:", data);
    }
  }, [data, error]);
  return (
    <>
      <div
        id="github-signup"
        onClick={() => handleGithubLogin()}
        className="min-w-2/5 rounded-sm flex items-center gap-2 justify-center text-sm bg-white text-gray-700 border border-gray-300 cursor-pointer"
      >
        <ImGithub size={20} />
        Sign in with Github
      </div>
    </>
  );
}

export default GithubAuthComponent;

import { useMutation } from "@apollo/client";
import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_AUTH_TOKEN_EXCHANGE } from "../../services/AuthService";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleAuthComponent() {
  const [googleAuthExchangeToken, { data, loading, error }] = useMutation(
    GOOGLE_AUTH_TOKEN_EXCHANGE,
  );

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const token = await googleAuthExchangeToken({
        variables: {
          token: codeResponse.code,
        },
      });

      console.log("Token:", token);
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Error during Google token exchange:", error);
    }

    if (loading) {
      console.log("Loading...");
    }

    if (data) {
      console.log("Google token exchange successful:", data);
    }
  }, [data, loading, error]);

  return (
    <>
      <>
        <div
          id="github-signup"
          onClick={() => googleLogin()}
          className="min-w-2/5 rounded-sm flex items-center gap-2 justify-center text-sm bg-white text-gray-700 border border-gray-300 cursor-pointer"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </div>
      </>
    </>
  );
}

export default GoogleAuthComponent;

import { useMutation } from "@apollo/client";
import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_AUTH_TOKEN_EXCHANGE } from "../../services/AuthService";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";

function GoogleAuthComponent() {
  const [googleAuthExchangeToken, { data, loading, error }] = useMutation(
    GOOGLE_AUTH_TOKEN_EXCHANGE,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      await googleAuthExchangeToken({
        variables: {
          token: codeResponse.code,
        },
      });
    },
  });

  useEffect(() => {
    if (error) {
      dispatch(signInFailure(error.message));
    }

    if (loading) {
      dispatch(signInStart());
    }

    if (data) {
      dispatch(signInSuccess(data.googleAuthExchangeToken));
      window.localStorage.setItem("token", data.googleAuthExchangeToken.token)
      navigate("/?auth=success");
    }
  }, [data, loading, error, dispatch, navigate]);

  return (
    <>
      <>
        <div
          id="github-signup"
          onClick={() => googleLogin()}
          className="min-w-2/5 flex-1 rounded-sm flex items-center gap-2 justify-center text-sm bg-white text-gray-700 border border-gray-300 cursor-pointer"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </div>
      </>
    </>
  );
}

export default GoogleAuthComponent;

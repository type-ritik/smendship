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
import { socialButtonClass } from "./AuthUI";

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
        variables: { token: codeResponse.code },
      });
    },
  });

  useEffect(() => {
    if (error) dispatch(signInFailure(error.message));
    if (loading) dispatch(signInStart());

    if (data) {
      dispatch(signInSuccess(data.googleAuthExchangeToken));
      window.localStorage.setItem("token", data.googleAuthExchangeToken.token);
      navigate("/?auth=success");
    }
  }, [data, loading, error, dispatch, navigate]);

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={loading}
      className={`${socialButtonClass} disabled:opacity-60`}
    >
      <FcGoogle size={20} />
      Google
    </button>
  );
}

export default GoogleAuthComponent;

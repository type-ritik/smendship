import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { OTP_VERIFICATION } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../redux/user/userSlice";

type VerifyOTPProps = {
  setFloatComponent: (visible: boolean) => void;
};

function VerifyOTPComponenet({ setFloatComponent }: VerifyOTPProps) {
  const [otp, setOtp] = useState(0);
  const [verifyAccount, { data, loading, error }] =
    useMutation(OTP_VERIFICATION);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOTPVerification = async () => {
    await verifyAccount({
      variables: {
        email: window.localStorage.getItem("email"),
        OTP: otp.toString(),
      },
    });
  };

  useEffect(() => {
    if (loading) {
      dispatch(signInStart());
      console.log("Verifying OTP...");
    }

    if (error) {
      dispatch(signInFailure(error.message));
      console.error("OTP Verification Error:", error.message);
    }

    if (data) {
      console.log("OTP Verification Successful:", data.verifyAccount);
      dispatch(signInSuccess(data.verifyAccount));
      window.localStorage.setItem("token", data.verifyAccount.token);
      setFloatComponent(false);
      navigate("/?signup=success");
    }
  }, [data, loading, error, navigate, dispatch, setFloatComponent]);
  return (
    <>
      <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center backdrop-blur-sm">
        <div className="border w-3/4 h-2/4! bg-white md:w-2/4 md:h-2/4 flex flex-col rounded p-5! justify-evenly">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-xl font-semibold">
              Verification code is sent.
            </h1>
            <p className="text-sm border p-2! rounded bg-[#f0ffff]">
              Please check your email and enter the code below to verify your
              account.
            </p>
          </div>
          <div className="flex flex-col gap-5 mt-5!">
            <input
              type="text"
              name="otp"
              id="otp"
              onChange={(e) => setOtp(parseInt(e.target.value))}
              maxLength={6}
              placeholder="Enter 6-digit OTP here"
              className="w-2/3! self-center text-center font-semibold"
            />
            <button
              onClick={() => handleOTPVerification()}
              className="bg-green-500! self-center w-2/3  text-white p-2! rounded"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOTPComponenet;

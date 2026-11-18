import { useMutation } from "@apollo/client";
import { useState } from "react";
import { OTP_VERIFICATION } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../redux/user/userSlice";
import { IoClose } from "react-icons/io5";
import { SubmitButton } from "../../Auth/AuthUI";

type VerifyOTPProps = {
  setFloatComponent: (visible: boolean) => void;
};

const OTP_LENGTH = 6;

function VerifyOTPComponenet({ setFloatComponent }: VerifyOTPProps) {
  // Kept as a string: the old parseInt() turned "012345" into 12345.
  const [otp, setOtp] = useState("");
  const [verifyAccount, { loading }] = useMutation(OTP_VERIFICATION);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const { data } = await verifyAccount({
        variables: { email: window.localStorage.getItem("email"), OTP: otp },
      });
      dispatch(signInSuccess(data.codeVerification));
      window.localStorage.setItem("token", data.codeVerification.token);
      setFloatComponent(false);
      navigate("/?signup=success");
    } catch (err) {
      const message = (err as Error).message || "That code didn't work.";
      dispatch(signInFailure(message));
      toast.error(message, { id: "otp" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={() => setFloatComponent(false)}
      role="presentation"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-title"
        onSubmit={handleOTPVerification}
        onClick={(e) => e.stopPropagation()}
        className="anim-pop relative flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-teal-100 bg-white p-6 text-center shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => setFloatComponent(false)}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:rotate-90 hover:bg-slate-100"
        >
          <IoClose size={20} />
        </button>

        <div>
          <h2 id="otp-title" className="text-xl font-semibold text-slate-900">
            Check your email
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            We sent a {OTP_LENGTH}-digit code. Enter it to verify your account.
          </p>
        </div>

        <input
          type="text"
          name="otp"
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="••••••"
          aria-label="Verification code"
          className="w-full rounded-xl border border-slate-300 py-3 text-center text-2xl font-semibold tracking-[0.5em] outline-none transition placeholder:text-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        <SubmitButton
          type="submit"
          loading={loading}
          disabled={otp.length !== OTP_LENGTH}
        >
          {loading ? "Verifying…" : "Verify account"}
        </SubmitButton>
      </form>
    </div>
  );
}

export default VerifyOTPComponenet;

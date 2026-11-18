import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RESET_USER_PASSWORD } from "../../services/AuthService";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { Field, SubmitButton } from "./AuthUI";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetUserPassword, { loading }] = useMutation(RESET_USER_PASSWORD);
  const navigate = useNavigate();
  const params = useParams();
  const { userId } = params;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Check both fields and try again.");
      return;
    }

    try {
      const { data } = await resetUserPassword({
        variables: {
          userId,
          password,
        },
      });
      toast.success(data.resetPassword.response);
      navigate("/profile");
    } catch (err) {
      toast.error((err as Error).message || "Couldn't reset your password.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        onClick={(e) => e.stopPropagation()}
        className="anim-pop relative w-full max-w-md rounded-2xl border border-teal-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:rotate-90 hover:bg-slate-100 hover:text-slate-800"
        >
          <IoClose size={20} />
        </button>

        <h2 id="reset-title" className="text-xl font-semibold text-slate-900">
          Reset password
        </h2>
        <p className="mb-5 mt-1 text-sm text-slate-500">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <Field
            id="password"
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="New password"
            autoComplete="new-password"
          />
          <Field
            id="confirm_password"
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
          <SubmitButton type="submit" loading={loading}>
            {loading ? "Saving…" : "Save new password"}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

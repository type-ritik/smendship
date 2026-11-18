import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { UserObjState } from "../../../utils/userInterfaces";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import {
  ALTER_PROFILE_DATA,
  usePasswordResetRequest,
} from "../../../services/AuthService";
import toast from "react-hot-toast";
import { profileUpdate } from "../../../redux/user/userSlice";
import { Field, SubmitButton } from "../../Auth/AuthUI";

const AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function EditProfile({
  isAlterProfileEnable,
  setIsAlterProfileEnable,
}: {
  isAlterProfileEnable: boolean;
  setIsAlterProfileEnable: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isResetpassword, setIsResetPassword] = useState(false);
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const { requestPasswordReset } = usePasswordResetRequest();
  const dispatch = useDispatch();

  const [updateprofile, { loading }] = useMutation(ALTER_PROFILE_DATA);

  const close = () => setIsAlterProfileEnable(false);

  // Escape closes this dialog (unless the reset-password dialog is on top)
  useEffect(() => {
    if (isAlterProfileEnable && isResetpassword) {
      void requestPasswordReset()
        .then(({ data }) => {
          if (data?.requestForPasswordReset) {
            toast.success(data.requestForPasswordReset.status);
          }
        })
        .catch((err: Error) => {
          toast.error("Couldn't request a password reset: " + err.message);
        });
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlterProfileEnable, isResetpassword]);

  const handleProfileAltering = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputPayload: Record<string, string> = {};
    if (email.trim().length > 0) inputPayload.email = email.trim();
    if (name.trim().length >= 2) inputPayload.name = name.trim();

    if (Object.keys(inputPayload).length === 0) {
      toast.error("Enter a new name (2+ characters) or email to save.");
      return;
    }

    try {
      const { data } = await updateprofile({
        variables: { input: inputPayload },
      });
      const user = data?.updateProfile;
      dispatch(profileUpdate({ email: user.email, name: user.name }));
      toast.success("Profile updated");
      close();
    } catch (err) {
      toast.error(
        "Couldn't update your profile: " + ((err as Error)?.message || ""),
      );
    }
  };

  if (!isAlterProfileEnable) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={close}
        role="presentation"
      >
        <form
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onSubmit={handleProfileAltering}
          onClick={(e) => e.stopPropagation()}
          className="anim-pop relative flex max-h-[92dvh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-t-2xl border border-teal-100 bg-white p-6 shadow-2xl sm:rounded-2xl"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:rotate-90 hover:bg-slate-100"
          >
            <IoClose size={20} />
          </button>

          <h2 id="edit-profile-title" className="text-lg font-semibold">
            Edit profile
          </h2>

          <div className="flex items-center gap-4">
            <img
              src={AVATAR}
              alt="Your profile"
              className="h-20 w-20 rounded-full border-4 border-teal-100 object-cover"
            />
            <button
              type="button"
              onClick={() => setIsResetPassword(true)}
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              Reset password
            </button>
          </div>

          <Field
            id="name"
            label="Name"
            value={name}
            onChange={setName}
            placeholder={currentUser?.user.name}
            autoComplete="name"
            required={false}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={currentUser?.user.email}
            autoComplete="email"
            required={false}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-sm font-medium text-slate-700">
              Bio
            </label>
            <textarea
              id="bio"
              maxLength={200}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
            <span className="self-end text-xs text-slate-400">
              {bio.length}/200
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <SubmitButton type="submit" loading={loading}>
              {loading ? "Saving…" : "Save profile"}
            </SubmitButton>
            <button
              type="button"
              onClick={() => toast("Account deletion isn't available yet.")}
              className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
            >
              Delete account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProfile;

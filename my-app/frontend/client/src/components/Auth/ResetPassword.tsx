import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RESET_USER_PASSWORD } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";

export default function ResetPassword({
  setIsResetPassword,
}: {
  setIsResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetUserPassword, { data, error, loading }] =
    useMutation(RESET_USER_PASSWORD);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success(data.resetUserPassword.message);
      navigate("/profile");
    }
  }, [loading, data, error, navigate]);

  const handleChangePassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (password === confirmPassword) {
      await resetUserPassword({
        variables: {
          password,
        },
      });
    } else {
      toast.error("Password aren't matching. Try again!");
    }
  };

  return (
    <div className="fixed inset-0 bg-white backdrop-blur-md top-0 left-0 z-10 w-full h-full flex justify-center items-center">
      <div className="w-1/2 h-3/5 relative shadow-xs bg-[#f0ffff] shadow-black rounded p-5! ">
        <div
          className="absolute top-15 right-0 p-2! cursor-pointer"
          onClick={() => setIsResetPassword(false)}
        >
          <IoExitOutline />
        </div>
        <div className="w-full rounded border p-2! bg-white flex justify-center items-center">
          <h1 className="text-sm">Reset Password!</h1>
        </div>
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          <div className="border rounded p-3! bg-[#f0ffff] shadow-xs shadow-blue-950 w-100">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border flex-1 rounded outline-none p-3! w-full bg-white"
            />
          </div>
          <div className="border rounded p-3! bg-[#f0ffff] shadow-xs shadow-blue-950 w-100">
            <label htmlFor="confirm_password">Confirm password</label>
            <input
              type="password"
              id="confirm_password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border flex-1 rounded outline-none p-3! w-full bg-white"
            />
          </div>
          <div className="w-100 flex justify-center items-center">
            <button
              onClick={(e) => handleChangePassword(e)}
              disabled={loading}
              className="flex-1 bg-blue-300! focus:bg-blue-500! cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

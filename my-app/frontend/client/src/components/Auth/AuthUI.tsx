import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/** Full-screen centered layout with drifting background orbs and a card. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-teal-50 to-white px-4 py-10">
      <div
        aria-hidden
        className="auth-orb pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-300/50"
      />
      <div
        aria-hidden
        className="auth-orb pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-sky-300/40"
        style={{ animationDelay: "-6s" }}
      />

      <div className="anim-pop relative w-full max-w-md rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </header>
        {children}
        {footer && (
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        )}
      </div>
    </div>
  );
}

/** Labelled input; password fields get a show/hide toggle. */
export function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            {visible ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );
}

/** Primary button with an inline spinner while loading. */
export function SubmitButton({
  loading,
  children,
  ...rest
}: {
  loading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading && (
        <span className="spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}

/** "or continue with" divider + slot for the social buttons. */
export function SocialRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or continue with
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export const socialButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-teal-600";

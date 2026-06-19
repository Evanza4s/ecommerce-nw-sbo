"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState, InputHTMLAttributes, forwardRef } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name?: string;
  error?: string;
  hint?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  type = "text",
  name,
  className,
  required,
  disabled,
  error,
  hint,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={name}
        className={cn(
          "text-sm font-medium text-slate-700",
          disabled && "opacity-50"
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          ref={ref}
          id={name}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors duration-200",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2",
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-200"
              : "border-slate-300 focus:border-primary focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            isPassword ? "pr-12" : "pr-4"
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className="text-xs text-red-500 mt-0.5" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${name}-hint`} className="text-xs text-slate-400 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
});

export default InputField;
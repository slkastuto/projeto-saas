import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-800">
            {label}
          </label>
        )}

        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition bg-white
          ${
            error
              ? "border-red-500 focus-within:ring-2 focus-within:ring-red-200"
              : "border-gray-300 focus-within:border-[#1F3A8A] focus-within:ring-2 focus-within:ring-[#1F3A8A]/20"
          }`}
        >
          {icon && (
            <span className="flex items-center text-gray-400">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            className={`w-full bg-transparent text-sm text-gray-900 outline-none
                        placeholder:text-gray-400 ${className}`}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

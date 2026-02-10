export function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2
                  rounded-2xl py-3 text-sm font-medium
                  bg-[#2FA84F] text-white
                  hover:opacity-90 transition
                  ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
                  ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[32px] shadow-card p-8 ${className}`}
    >
      {children}
    </div>
  );
}

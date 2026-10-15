import type { HTMLAttributes } from "react";

type Width = "content" | "wide" | "narrow";

const widthClass: Record<Width, string> = {
  narrow: "max-w-3xl",
  content: "max-w-[1200px]",
  wide: "max-w-[1440px]",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: Width;
}

export function Container({
  width = "content",
  className = "",
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widthClass[width]} ${className}`}
      {...rest}
    />
  );
}

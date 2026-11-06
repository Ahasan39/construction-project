import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

/**
 * Smart link primitive: internal routes use react-router, absolute/external
 * URLs render as plain anchors with safe `rel` attributes.
 */
export interface SmartLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  external?: boolean;
  children: ReactNode;
}

function isAbsolute(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
}

export function SmartLink({
  to,
  external,
  children,
  className = "",
  ...rest
}: SmartLinkProps) {
  const treatAsExternal = external || isAbsolute(to);

  if (treatAsExternal) {
    const isHttp = /^https?:\/\//i.test(to);
    return (
      <a
        href={to}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} className={className} {...rest}>
      {children}
    </RouterLink>
  );
}

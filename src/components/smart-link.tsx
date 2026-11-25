import NextLink from "next/link";
import type { ComponentProps } from "react";

import { isExternal } from "@/lib/utils";

/** Renders an <a target=_blank> for absolute URLs and a Next <Link> otherwise. */
export function SmartLink({ href, ...props }: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  if (isExternal(href) || href.startsWith("mailto:") || href.startsWith("#")) {
    const ext = isExternal(href);
    return <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props} />;
  }
  return <NextLink href={href} {...props} />;
}

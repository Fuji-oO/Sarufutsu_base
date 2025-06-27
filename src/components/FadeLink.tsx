"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type FadeLinkProps = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

const FadeLink = ({ href, children, ...props }: FadeLinkProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // 外部リンクや新規タブは通常遷移
    if (
      typeof href === "string" &&
      (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:"))
    ) {
      return;
    }
    e.preventDefault();
    document.body.classList.add("fadeout");
    setTimeout(() => {
      router.push(href as string);
    }, 600);
  };

  return (
    <Link href={href} {...props} onClick={handleClick} prefetch={false}>
      {children}
    </Link>
  );
};

export default FadeLink; 
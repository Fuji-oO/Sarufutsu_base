"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useTransition } from "./TransitionContext";

type FadeLinkProps = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

const FadeLink = ({ href, children, ...props }: FadeLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition, endTransition } = useTransition();

  useEffect(() => {
    endTransition();
    // eslint-disable-next-line
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // 外部リンクや新規タブは通常遷移
    if (
      typeof href === "string" &&
      (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:"))
    ) {
      if (props.onClick) props.onClick(e);
      return;
    }
    if (props.onClick) props.onClick(e);
    e.preventDefault();
    // 同じパスなら何もしない
    if (pathname === href) return;
    startTransition();
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
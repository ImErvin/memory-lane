"use client";

import useUserStore from "@/stores/user-store";
import Link from "next/link";
import UnauthenticatedActions from "./unauthenticated-actions";
import AuthenticatedActions from "./authenticated-actions";

const Header = () => {
  const { username } = useUserStore();

  return (
    <header className="fixed left-1/2 z-50 mx-auto flex w-full max-w-hd -translate-x-1/2 flex-row items-center justify-between gap-4 px-4 py-4">
      <Link
        href="/"
        className="group flex h-10 w-10 items-center justify-center rounded-xl border bg-white p-2 transition-colors hover:bg-black"
      >
        <span className="mt-0.5 font-magilio text-2xl font-black leading-none tracking-wide transition-colors group-hover:text-secondary">
          ML
        </span>
      </Link>
      {!username ? <UnauthenticatedActions /> : <AuthenticatedActions />}
    </header>
  );
};

export default Header;

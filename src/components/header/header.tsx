"use client";

import useUserStore from "@/stores/user-store";
import Link from "next/link";
import UnauthenticatedActions from "./unauthenticated-actions";
import AuthenticatedActions from "./authenticated-actions";

const Header = () => {
  const { username } = useUserStore();

  return (
    <header className="fixed left-1/2 mx-auto flex w-full max-w-hd -translate-x-1/2 flex-row items-center justify-between gap-4 px-4 py-4">
      <Link href="/" className="font-magilio text-3xl font-black leading-none">
        memory
      </Link>
      {!username ? <UnauthenticatedActions /> : <AuthenticatedActions />}
    </header>
  );
};

export default Header;

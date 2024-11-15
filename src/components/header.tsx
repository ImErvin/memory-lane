import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="max-w-hd fixed left-1/2 mx-auto flex w-full -translate-x-1/2 flex-row items-center justify-between gap-4 px-4 py-4">
      <Link href="/" className="font-magilio text-3xl font-black leading-none">
        memory
      </Link>
      <Button variant={"default"} size={"lg"}>
        Sign In
      </Button>
    </header>
  );
};

export default Header;

import useUserStore from "@/stores/user-store";
import { Button } from "../ui/button";
import BoringAvatar from "../ui/boring-avatar";
import { CardContent, CardFooter } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

const AUTHENTICATED_PATHS = (username: string) => [
  {
    name: "Profile",
    href: `/users/${username}`,
  },
];

export const ProfileAction: React.FC = () => {
  const { username, clearUser: signout } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  // Dont expect to hit this state as ProfileAction should only be rendered when username is present
  if (!username) {
    return null;
  }

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="flex gap-6 pl-3 pr-3"
        >
          <BoringAvatar name={username} size={"sm"} className="mr-auto" />
          <p className="mr-auto hidden max-w-full truncate md:block">
            {username}
          </p>
          <ChevronDown
            className={clsx(
              "ml-auto hidden md:block transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <CardContent className="px-1 pb-1 pt-1">
          {username &&
            AUTHENTICATED_PATHS(username).map((path) => (
              <Link key={path.href} href={path.href}>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  {path.name}
                </Button>
              </Link>
            ))}
        </CardContent>
        <CardFooter className="border-t p-1">
          <Button
            variant={"ghost"}
            onClick={signout}
            size={"lg"}
            className="w-full justify-start"
          >
            Sign out
          </Button>
        </CardFooter>
      </PopoverContent>
    </Popover>
  );
};

const AuthenticatedActions: React.FC = () => {
  return (
    <>
      <ProfileAction />
    </>
  );
};

export default AuthenticatedActions;

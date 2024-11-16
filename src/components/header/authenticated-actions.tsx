import useUserStore from "@/stores/user-store";
import { Button } from "../ui/button";
import BoringAvatar from "../ui/boring-avatar";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { useState } from "react";

const AUTHENTICATED_PATHS = (username: string) => [
  {
    name: "Profile",
    href: `/users/${username}`,
  },
];

export const ProfileAction: React.FC = () => {
  const { username, clearUser: signout } = useUserStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Dont expect to hit this state as ProfileAction should only be rendered when username is present
  if (!username) {
    return null;
  }

  return (
    <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="flex max-w-48 gap-6 pl-3"
        >
          <BoringAvatar name={username} size={"sm"} className="mr-auto" />
          <p className="mr-auto max-w-full truncate">{username}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <CardHeader className="block p-2 px-3 lg:hidden">
          <CardDescription className="flex flex-col gap-1">
            <p className="text-xs">Signed in as</p>
            <div className="flex w-full flex-row items-center gap-2">
              <BoringAvatar name={username} size={"xs"} />

              <p className="max-w-full truncate text-base">{username}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-1 pb-1 pt-1">
          {username &&
            AUTHENTICATED_PATHS(username).map((path) => (
              <Link key={path.href} href={path.href}>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="w-full justify-start"
                  onClick={() => setIsPopoverOpen(false)}
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

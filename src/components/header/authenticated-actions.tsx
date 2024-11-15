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

export const ProfileAction: React.FC = () => {
  const { username, clearUser: signout } = useUserStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
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
          <Link href={`/memories/${username}`}>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="w-full justify-start"
            >
              Memories
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="border-t p-1">
          <Button
            variant={"ghost"}
            onClick={signout}
            size={"sm"}
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

import useUserStore from "@/stores/user-store";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "../ui/button";
import Avatar from "boring-avatars";
import BoringAvatar from "../ui/boring-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";

export const ProfileAction: React.FC = () => {
  const { username, clearUser: signout } = useUserStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="flex h-10 w-10">
          <BoringAvatar name={username} size={"lg"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <CardHeader className="p-2 px-3">
          <CardDescription className="flex flex-col gap-1">
            <p className="text-xs">Signed in as</p>
            <div className="flex w-full flex-row items-center gap-2">
              <BoringAvatar name={username} size={"xs"} />

              <p className="max-w-full truncate text-base">{username}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-1 pb-1">
          <Link href={`/${username}`}>
            <Button variant={"ghost"} size={"sm"} className="w-full justify-start">
              Profile
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="border-t p-1">
          <Button variant={"ghost"} onClick={signout} size={"sm"} className="w-full justify-start">
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

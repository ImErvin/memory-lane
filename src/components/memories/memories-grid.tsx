"use client";

import { useUserMemories } from "@/contexts/user-memories";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import useUserStore from "@/stores/user-store";

const NoMemories: React.FC = () => {
  const { username } = useUserMemories();
  const { username: signedInUsername } = useUserStore();

  const isSignedInUser = signedInUsername === username;

  return (
    <Card className="m-auto flex w-full max-w-[360px] flex-col">
      <CardHeader>
        <CardTitle className="text-xl tracking-normal">
          Nothing to see here 🤷‍♂️
        </CardTitle>
        <CardDescription className="w-full">
          <p className="max-w-full text-wrap break-words">
            {isSignedInUser ? "You haven't" : `${username} hasn't`} added any
            memories yet.
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row items-center justify-between gap-4">
        <Link href="/">
          <Button variant="secondary" size="sm">
            Go Home
          </Button>
        </Link>
        {isSignedInUser && (
          <Link href="/add">
            <Button variant="default" size="sm">
              Add your first memory
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

const MemoriesGrid: React.FC = () => {
  const { memories } = useUserMemories();

  if (true) {
    return <NoMemories />;
  }

  return <h1>hey</h1>;
};

export default MemoriesGrid;

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

const NoMemories: React.FC = () => {
  const { username } = useUserMemories();

  return (
    <Card className="m-auto flex w-full min-w-[360px] max-w-[360px] flex-col">
      <CardHeader>
        <CardTitle className="text-xl tracking-normal">
          Nothing to see here 🤷‍♂️
        </CardTitle>
        <CardDescription className="w-full">
          <p className="max-w-full text-wrap break-words">
            {username} hasn&apos;t added any memories yet.
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row items-center justify-between gap-4">
        <Link href="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const MemoriesGrid: React.FC = () => {
  const { memories } = useUserMemories();

  if (memories?.length === 0) {
    return <NoMemories />;
  }

  return <h1>hey</h1>;
};

export default MemoriesGrid;

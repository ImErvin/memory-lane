"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-3 bg-red-500 text-white">
      <h1 className="font-magilio text-4xl">Page Not Found</h1>
      <p className="max-w-[300px] text-center text-2xl">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft />
          Go back home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;

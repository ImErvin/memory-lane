import { useMemoryLane } from "@/contexts/use-memory-lane";
import { animated, useScroll } from "@react-spring/web";
import { useEffect, useMemo } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface MemoryViewProps {
  id: number;
  name: string;
  description?: string | null;
  timestamp: Date;
  pageNumber: number;
}

const MemoryView: React.FC<MemoryViewProps> = (props) => {
  const { memories } = useMemoryLane();

  return (
    <section className="relative flex h-screen flex-shrink-0 flex-col bg-white group">
      <div className="mx-auto flex h-full w-full max-w-hd flex-col items-center justify-center px-4">
        <img
          src={`https://picsum.photos/${1200 + props.pageNumber}`}
          alt={props.name}
          className="z-10 h-full max-h-[80%] w-full max-w-full object-contain object-center"
        />

        <Card className="z-10 mr-auto">
          <CardHeader>
            <CardTitle>{props.name}</CardTitle>
            {props?.description && (
              <CardDescription>{props.description}</CardDescription>
            )}
          </CardHeader>
        </Card>
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden group">
          <img
            src={`https://picsum.photos/${1200 + props.pageNumber}`}
            alt={props.name}
            className="z-0 h-full w-full object-cover object-center blur-lg"
            style={{
              // maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))`,
            }}
          />

          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black group-first:to-white"/>
        </div>
      </div>
    </section>
  );
};

export default MemoryView;

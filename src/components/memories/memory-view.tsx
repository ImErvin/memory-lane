import { useMemoryLane } from "@/contexts/use-memory-lane";
import {
  animated,
  config,
  useInView,
  useScroll,
  useSpring,
} from "@react-spring/web";
import { useEffect, useMemo } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { format } from "date-fns/format";
import { Button } from "../ui/button";
import Link from "next/link";

interface MemoryViewProps {
  id: number;
  name: string;
  description?: string | null;
  timestamp: Date;
  imageUrl: string;
}

const MemoryView: React.FC<MemoryViewProps> = (props) => {
  const [ref, inView] = useInView({
    amount: 0.5,
  });

  const fadeInOutSpring = useSpring({
    from: { opacity: 0, scale: 1, filter: "blur(40px)" },
    to: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 1.1,
      filter: "blur(20px)",
    },
    config: config.molasses,
  });
  return (
    <Card className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl">
      <animated.div className="absolute inset-0 z-0 h-full w-full flex-shrink-0 bg-cover bg-center">
        <AnimatedImage
          style={fadeInOutSpring}
          src={props.imageUrl}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
        />
      </animated.div>
      <div
        ref={ref}
        className="relative z-10 flex h-full max-h-[95%] min-h-[400px] w-full max-w-full items-center justify-center border-b object-center p-4"
      >
        <Image
          src={props.imageUrl}
          alt={props.name}
          className="rounded-xl object-contain object-center"
          width={400}
          height={400}
        />
      </div>
      <div className="z-10 flex w-full flex-col bg-white pr-4">
        <CardHeader className="w-full max-w-[360px]">
          <CardTitle className="text-xl lg:text-3xl">{props.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {props?.description && (
            <CardDescription className="w-full max-w-[360px]">
              {props.description}
            </CardDescription>
          )}
          <h3 className="text-sm text-gray-500">
            {format(new Date(props.timestamp), "MMM dd, yyyy")}
          </h3>
        </CardContent>
        <CardFooter>
          <Link href={`/memories/${props.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

const AnimatedImage = animated(Image);

export default MemoryView;

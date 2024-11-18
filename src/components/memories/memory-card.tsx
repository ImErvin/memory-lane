import { animated, config, useInView, useSpring } from "@react-spring/web";
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
import useUserStore from "@/stores/user-store";
import { toZonedTime } from "date-fns-tz";
import MemoryActionDropdownMenu from "../memory/memory-actions-popover";

interface MemoryCardProps {
  id: number;
  name: string;
  description?: string | null;
  timestamp: string;
  imageUrl: string;
  creator: string;
  laneId: number;
}

const MemoryCard: React.FC<MemoryCardProps> = (props) => {
  const { username } = useUserStore();
  const [ref, inView] = useInView({
    amount: 0.5,
  });

  const fadeInOutSpring = useSpring({
    from: { opacity: 0, scale: 1},
    to: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 1.1,
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
          className="blur-md"
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
      <div className="z-10 flex w-full flex-col bg-white">
        <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
          <CardTitle className="max-w-[360px] truncate">{props.name}</CardTitle>

          {username === props.creator && (
            <MemoryActionDropdownMenu
              laneId={props.laneId}
              creator={props.creator}
              description={props.description ?? ""}
              memoryId={props.id}
              name={props.name}
              timestamp={props.timestamp}
              imageUrl={props.imageUrl}
            />
          )}
        </CardHeader>
        <CardContent>
          {props?.description && (
            <CardDescription className="w-full max-w-[360px]">
              {props.description}
            </CardDescription>
          )}
          <h3 className="text-sm text-gray-500">
            {format(toZonedTime(props.timestamp, "UTC"), "MMM dd, yyyy")}
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

export default MemoryCard;

import { animated } from "@react-spring/web";
import Avatar from "boring-avatars";
import type { AvatarProps } from "boring-avatars";
import { cva, type VariantProps } from "class-variance-authority";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const avatarStyles = cva("", {
  variants: {
    size: {
      xs: 14,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 40,
      xxl: 64,
      custom: 0,
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type BoringAvatarVariantProps = VariantProps<typeof avatarStyles>;

interface BoringAvatarBaseProps
  extends Omit<AvatarProps, "colors" | "variant" | "size">,
    BoringAvatarVariantProps,
    React.SVGAttributes<SVGElement> {}

interface CustomSizeRequiredProps extends BoringAvatarBaseProps {
  size: "custom";
  customSize: number;
}

interface StandardSizeProps extends BoringAvatarBaseProps {
  size: Exclude<BoringAvatarVariantProps["size"], "custom">;
  customSize?: number;
}

type BoringAvatarProps = StandardSizeProps | CustomSizeRequiredProps;

const BoringAvatar: React.FC<BoringAvatarProps> = (props) => {
  const { size = "md", customSize, ...rest } = props;

  const computedSize =
    size === "custom" && customSize ? customSize : avatarStyles({ size });

  return (
    <Avatar {...rest} colors={COLORS} variant="beam" size={computedSize ?? 0} />
  );
};

export const AnimatedBoringAvatar = animated(BoringAvatar);

export default BoringAvatar;

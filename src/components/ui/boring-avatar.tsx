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
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface BoringAvatarProps
  extends Omit<AvatarProps, "colors" | "variant" | "size">,
    VariantProps<typeof avatarStyles> {}

const BoringAvatar: React.FC<BoringAvatarProps> = (props) => {
  const { size = "md", ...rest } = props;
  const computedSize = avatarStyles({ size });

  return (
    <Avatar {...rest} colors={COLORS} variant="beam" size={computedSize} />
  );
};

export default BoringAvatar;

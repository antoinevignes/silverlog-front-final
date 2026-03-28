import "./avatar.scss";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type AvatarProps = {
  src?: string | null;
  username?: string;
  size?: AvatarSize;
  isLoading?: boolean;
  className?: string;
};

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 44,
  xl: 96,
  "2xl": 152,
};

export function Avatar({
  src,
  username,
  size = "md",
  isLoading = false,
  className = "",
}: AvatarProps) {
  const dimension = sizeMap[size];
  const initial = username?.charAt(0)?.toUpperCase() || "U";
  const sizeClass = size === "2xl" ? "avatar-2xl" : "";
  const style = size === "2xl" ? {} : { width: dimension, height: dimension };

  if (isLoading) {
    return (
      <div
        className={`avatar avatar-skeleton ${sizeClass} ${className}`.trim()}
        style={style}
        aria-label="Chargement de l'avatar"
      >
        <div className="avatar-skeleton-inner" />
      </div>
    );
  }

  if (src) {
    return (
      <div
        className={`avatar avatar-img-wrapper ${sizeClass} ${className}`.trim()}
        style={style}
      >
        <Image
          src={getCloudinarySrc(src, "avatars")}
          width={dimension}
          height={dimension}
          layout="constrained"
          background="auto"
          alt={`Avatar de ${username}`}
          className="avatar-img"
        />
      </div>
    );
  }

  return (
    <div
      className={`avatar avatar-initial font-sentient ${sizeClass} ${className}`.trim()}
      style={style}
      aria-label={`Initiale de ${username}`}
    >
      {initial}
    </div>
  );
}

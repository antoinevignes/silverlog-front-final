import "./Skeleton.scss";

interface SkeletonProps {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({
  width,
  height,
  className = "",
}: SkeletonProps) {
  const style = {
    width: width,
    height: height,
  };

  return (
    <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
  );
}

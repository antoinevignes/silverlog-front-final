export function getCloudinarySrc(path: string, folder: string) {
  if (!path) return "";
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${import.meta.env.VITE_CLOUDINARY_URL}/silverlog/${folder}/${cleanPath}`;
}

export function getCloudinarySrc(path: string, folder: string) {
  if (!path) return "";
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${import.meta.env.VITE_CLOUDINARY_URL}/silverlog/${folder}/${cleanPath}`;
}

export function getCloudinaryPlaceholder(path: string, folder: string) {
  if (!path) return undefined;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${import.meta.env.VITE_CLOUDINARY_URL}/w_20,e_blur:1000,q_1,f_auto/silverlog/${folder}/${cleanPath}`;
}

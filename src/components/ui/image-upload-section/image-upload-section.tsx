import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Image } from "@unpic/react";
import Button from "@/components/ui/button/button";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";

interface ImageUploadSectionProps {
  currentPath: string | null;
  folder: string;
  altText: string;
  placeholder: React.ReactNode;
  uploadZoneClassName: string;
  formClassName: string;
  previewClassName: string;
  currentClassName: string;
  onUpload: (file: File) => void;
  isUploading: boolean;
  onDelete: () => void;
  isDeleting: boolean;
  previewWidth: number;
  previewHeight: number;
  inputAriaLabel: string;
  deleteAriaLabel: string;
}

export default function ImageUploadSection({
  currentPath,
  folder,
  altText,
  placeholder,
  uploadZoneClassName,
  formClassName,
  previewClassName,
  currentClassName,
  onUpload,
  isUploading,
  onDelete,
  isDeleting,
  previewWidth,
  previewHeight,
  inputAriaLabel,
  deleteAriaLabel,
}: ImageUploadSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    onUpload(file);
  };

  const handleClear = () => {
    if (previewUrl || file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } else if (currentPath) {
      onDelete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <div className={uploadZoneClassName}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Aperçu"
            className={previewClassName}
            layout="constrained"
            width={previewWidth}
            height={previewHeight}
            background="auto"
            priority
          />
        ) : currentPath ? (
          <Image
            src={getCloudinarySrc(currentPath, folder)}
            layout="constrained"
            width={previewWidth}
            height={previewHeight}
            alt={altText}
            background="auto"
            priority
            className={currentClassName}
          />
        ) : (
          placeholder
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          Choisir une image
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
          aria-label={inputAriaLabel}
        />
      </div>

      <Button type="submit" size="sm" disabled={isUploading || !file}>
        {isUploading ? "Upload..." : "Enregistrer"}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="destructive"
        disabled={
          isUploading || isDeleting || (!previewUrl && !file && !currentPath)
        }
        onClick={handleClear}
        aria-label={deleteAriaLabel}
      >
        <Trash2 size={20} />
      </Button>
    </form>
  );
}

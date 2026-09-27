import { useRef, useState } from "react";
import type { CustomField } from "@puckeditor/core";
import { SUPPORTED_IMAGE_TYPES, uploadPortfolioImage } from "../lib/storage";

function ImagePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await uploadPortfolioImage(file);
      onChange(imageUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded.",
      );
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="image-field">
      {value && (
        <div className="image-field__preview">
          <img src={value} alt="Selected" />
        </div>
      )}
      <div className="image-field__actions">
        <button
          type="button"
          className="image-field__button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value && (
          <button
            type="button"
            className="image-field__button image-field__button--ghost"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="image-field__error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_IMAGE_TYPES.join(",")}
        className="image-field__input"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

export const imageField: CustomField<string> = {
  type: "custom",
  render: ({ value, onChange }) => (
    <ImagePicker value={value} onChange={onChange} />
  ),
};

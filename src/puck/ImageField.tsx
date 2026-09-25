import { useRef, useState } from "react";
import type { CustomField } from "@puckeditor/core";

// Reads a local file and stores it as a data URL so no backend/upload is needed for the prototype.
const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function ImagePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } finally {
      setIsLoading(false);
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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

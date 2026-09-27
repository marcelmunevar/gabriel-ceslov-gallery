import { supabase } from "./supabase";

export const PORTFOLIO_IMAGES_BUCKET = "portfolio-images";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const getManagedImagePath = (value: string) => {
  try {
    const url = new URL(value);
    const prefix = `/storage/v1/object/public/${PORTFOLIO_IMAGES_BUCKET}/`;
    const prefixIndex = url.pathname.indexOf(prefix);

    if (prefixIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(prefixIndex + prefix.length));
  } catch {
    return null;
  }
};

export async function uploadPortfolioImage(file: File) {
  if (
    !SUPPORTED_IMAGE_TYPES.includes(
      file.type as (typeof SUPPORTED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error("Use a JPEG, PNG, WebP, or AVIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Images must be 5 MB or smaller.");
  }

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!data.user) throw new Error("Sign in before uploading an image.");

  const extension = extensionByMimeType[file.type];
  const path = `${data.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(PORTFOLIO_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return supabase.storage.from(PORTFOLIO_IMAGES_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

export async function deletePortfolioImage(value: string) {
  const path = getManagedImagePath(value);
  if (!path) return;

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!data.user || path.split("/")[0] !== data.user.id) {
    throw new Error("You can only delete your own portfolio images.");
  }

  const { error } = await supabase.storage
    .from(PORTFOLIO_IMAGES_BUCKET)
    .remove([path]);
  if (error) throw error;
}

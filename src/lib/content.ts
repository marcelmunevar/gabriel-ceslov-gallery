import type { Data } from "@puckeditor/core";
import type { Components } from "../puck/config";
import { sampleData } from "../puck/sampleData";
import type { Json } from "./database.types";
import { supabase } from "./supabase";

export const PORTFOLIO_PAGE_SLUG = "portfolio";

export type PuckData = Data<Components>;

const toPuckData = (content: Json): PuckData => content as PuckData;
const toJson = (data: PuckData): Json => data as unknown as Json;

async function getAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Sign in to manage portfolio content.");
  return data.user;
}

export async function loadDraft(
  slug = PORTFOLIO_PAGE_SLUG,
): Promise<PuckData | null> {
  await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("page_drafts")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? toPuckData(data.content) : null;
}

export async function loadOrSeedDraft(
  slug = PORTFOLIO_PAGE_SLUG,
): Promise<PuckData> {
  const draft = await loadDraft(slug);
  if (draft) return draft;

  await saveDraft(sampleData, slug);
  return sampleData;
}

export async function saveDraft(
  content: PuckData,
  slug = PORTFOLIO_PAGE_SLUG,
): Promise<PuckData> {
  const user = await getAuthenticatedUser();
  const { error } = await supabase.from("page_drafts").upsert(
    {
      slug,
      owner_id: user.id,
      content: toJson(content),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  if (error) throw error;
  return content;
}

export async function loadPublishedPage(
  slug = PORTFOLIO_PAGE_SLUG,
): Promise<PuckData | null> {
  const { data, error } = await supabase
    .from("published_pages")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? toPuckData(data.content) : null;
}

export async function publishPage(
  content: PuckData,
  slug = PORTFOLIO_PAGE_SLUG,
): Promise<PuckData> {
  const user = await getAuthenticatedUser();
  const now = new Date().toISOString();
  const { error } = await supabase.from("published_pages").upsert(
    {
      slug,
      owner_id: user.id,
      content: toJson(content),
      published_at: now,
      updated_at: now,
    },
    { onConflict: "slug" },
  );

  if (error) throw error;
  return content;
}

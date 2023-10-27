import type { Track } from "@spotify/web-api-ts-sdk";
import type { Tables } from "../../types/types";
import { removeSongExtraText, slugifyCover } from "../../helpers/helpers";

type Props = {
  original: Track;
  cover: Track;
  description: string;
  contributor: string;
};

export const formatCoverRow = async ({
  original,
  cover,
  description,
  contributor,
}: Props) => {
  const row: Omit<Tables<"covers">, "id" | "created_at" | "tags"> = {
    original_id: original.id,
    cover_id: cover.id,
    slug: slugifyCover(cover.name, cover.artists[0].name),
    description,
    contributor,
  };

  return row;
};

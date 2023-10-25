import type { Track } from "@spotify/web-api-ts-sdk";
import type { Tables } from "../../types/types";
import { removeSongExtraText } from "../../helpers/helpers";

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
  const slugify = (str: string) => {
    return str
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove consecutive hyphens
  };

  const makeSlug = (cover: Track) => {
    const slug = `${slugify(removeSongExtraText(cover.name))}-${slugify(
      cover.artists[0].name
    )}`;
    return slug;
  };

  const row: Omit<Tables<"covers">, "id" | "created_at" | "tags"> = {
    original_id: original.id,
    cover_id: cover.id,
    slug: makeSlug(cover),
    description,
    contributor,
  };

  return row;
};

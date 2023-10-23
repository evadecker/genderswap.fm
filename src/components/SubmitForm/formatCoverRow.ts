import type { AudioFeatures, Track } from "@spotify/web-api-ts-sdk";
import type { Enums, Tables } from "../../types/types";

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
    // Remove parentheses from songs if they have a space beforehand
    // MATCH: "Crazy in Love (feat. Jay-Z)" -> "Crazy in Love"
    // DO NOT MATCH: "(I Can't Get No) Satisfaction"
    const songNoParentheses = cover.name.replace(/\s\([^()]*\)/g, "").trim();

    // Remove everything after a ' - ' in the song name
    // "Can't Get You out of My Head - Live at KEXP" -> "Can't Get You out of My Head"
    const songNoDash = songNoParentheses.split(" - ")[0];

    const slug = `${slugify(songNoDash)}-${slugify(cover.artists[0].name)}`;
    return slug;
  };

  const row: Omit<Tables<"covers">, "id" | "created_at"> = {
    original_id: original.id,
    cover_id: cover.id,
    slug: makeSlug(cover),
    description,
    contributor,
  };

  return row;
};

import type { Tables } from "../types/types";

export const getMaxCharacterHelpText = (input: string, maxLength: number) => {
  if (input.length === 0) {
    return `${maxLength} characters max`;
  }

  if (input.length > maxLength) {
    return `${input.length - maxLength} ${
      input.length - maxLength === 1 ? "character" : "characters"
    } over limit`;
  }

  return `${maxLength - input.length} ${
    maxLength - input.length === 1 ? "character" : "characters"
  } left`;
};

export const getReadableTitle = ({
  original,
  cover,
}: {
  original: Tables<"songs"> | null;
  cover: Tables<"songs"> | null;
}) => {
  if (original === null || cover === null) return "";
  return `${cover?.artists[0]}’s cover of ${original?.name} by ${original?.artists[0]}`;
};

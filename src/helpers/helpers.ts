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
  originalName,
  originalArtists,
  coverArtists,
}: {
  originalName: string;
  originalArtists: string[];
  coverArtists: string[];
}) => {
  return `${coverArtists[0]}’s cover of ${originalName} by ${originalArtists[0]}`;
};

export const removeSongExtraText = (song: string) => {
  const songNoExtras = song
    // Remove parentheses from songs *if* they have a space beforehand
    // MATCH: "Crazy in Love (feat. Jay-Z)" -> "Crazy in Love"
    // DO NOT MATCH: "(I Can't Get No) Satisfaction"
    .replace(/\s\([^()]*\)/g, "")
    .trim()
    // Remove everything after a ' - ' in the song name
    // "Can't Get You out of My Head - Live at KEXP" -> "Can't Get You out of My Head"
    .split(" - ")[0];

  return songNoExtras;
};

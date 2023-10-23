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

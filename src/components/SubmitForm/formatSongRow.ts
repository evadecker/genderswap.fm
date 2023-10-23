import type { Track } from "@spotify/web-api-ts-sdk";
import type { Enums, Tables } from "../../types/types";

type Props = {
  song: Track;
  gender: Enums<"gender">[];
};

const getAudioFeatures = async (id?: string) => {
  if (!id) {
    console.log("missing id");
    return;
  }

  try {
    const response = await fetch(`/api/getAudioFeatures/${id}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const formatSongRow = async ({ song, gender }: Props) => {
  const audioFeatures = await getAudioFeatures(song.id);

  const formattedName = song.name
    .split(" - ")[0] // "Smells Like Teen Spirit - Radio Edit" -> "Smells Like Teen Spirit"
    .replace(/\s\([^()]*\)/g, ""); // "Time After Time (2022 Remaster)" -> "Time After Time"

  const row: Omit<Tables<"songs">, "created_at"> = {
    id: song.id,
    name: formattedName,
    artists: song.artists.map((artist) => artist.name),
    url: song.external_urls.spotify,
    album_name: song.album.name,
    album_year: parseInt(song.album.release_date.slice(0, 4)),
    album_img: song.album.images.map((image) => image.url),
    gender: gender,
    acousticness: audioFeatures.acousticness,
    danceability: audioFeatures.danceability,
    duration_ms: audioFeatures.duration_ms,
    energy: audioFeatures.energy,
    instrumentalness: audioFeatures.instrumentalness,
    key: audioFeatures.key,
    liveness: audioFeatures.liveness,
    loudness: audioFeatures.loudness,
    mode: audioFeatures.mode,
    speechiness: audioFeatures.speechiness,
    tempo: audioFeatures.tempo,
    time_signature: audioFeatures.time_signature,
    valence: audioFeatures.valence,
  };

  return row;
};

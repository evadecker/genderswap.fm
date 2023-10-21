import type { Track } from "@spotify/web-api-ts-sdk";
import type { Tables } from "../../types/types";

// Given a Spotify Track object, return a row for the song table
export function getSongRowFromTrack(
  track: Track | null | undefined
): Omit<Tables<"songs">, "created_at"> | null {
  if (!track) {
    return null;
  }

  const song = {
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    url: track.external_urls.spotify,
    album_name: track.album.name,
    album_year: parseInt(track.album.release_date.slice(0, 4)),
    album_img: track.album.images[0].url,
  };

  return song;
}

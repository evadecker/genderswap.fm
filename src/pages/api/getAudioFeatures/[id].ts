import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { APIRoute } from "astro";

const spotify = SpotifyApi.withClientCredentials(
  import.meta.env.SPOTIFY_CLIENT_ID,
  import.meta.env.SPOTIFY_CLIENT_SECRET
);

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  const results = await spotify.tracks.audioFeatures(id);

  return Response.json(results);
};

import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { APIRoute } from "astro";

const spotify = SpotifyApi.withClientCredentials(
  import.meta.env.SPOTIFY_CLIENT_ID,
  import.meta.env.SPOTIFY_CLIENT_SECRET
);

export const POST: APIRoute = async ({ request }) => {
  const query = await request.text();

  const results = await spotify.search(query, ["track"], undefined, 20);
  const tracks = results.tracks.items;

  return Response.json(tracks);
};

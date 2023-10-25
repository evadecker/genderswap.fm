import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { APIRoute } from "astro";

const spotify = SpotifyApi.withClientCredentials(
  import.meta.env.SPOTIFY_CLIENT_ID,
  import.meta.env.SPOTIFY_CLIENT_SECRET
);

export const GET: APIRoute = async ({ params }) => {
  const query = params.query;

  if (!query) return Response.json({});

  const results = (await spotify.search(query, ["track"], undefined, 10)).tracks
    .items;

  return Response.json(results);
};

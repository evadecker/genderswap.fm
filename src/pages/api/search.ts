import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { APIRoute } from "astro";

const spotify = SpotifyApi.withClientCredentials(
  import.meta.env.SPOTIFY_CLIENT_ID,
  import.meta.env.SPOTIFY_CLIENT_SECRET
);

export const POST: APIRoute = async ({ request }) => {
  const query = await request.text();
  const results = await spotify.search(query, ["track"], undefined, 10);
  const tracks = results.tracks.items;

  if (!tracks) {
    return new Response(
      JSON.stringify({
        message: "No results found",
      }),
      { status: 400 }
    );
  }

  return new Response(JSON.stringify(tracks), { status: 200 });
};

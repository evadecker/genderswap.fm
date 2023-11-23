import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const spotify = SpotifyApi.withClientCredentials(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

// Given a Spotify track ID, returns a new Track object with the earliest release of that song
export async function GET({ url }) {
  const track = url.searchParams.get('track');
  const artist = url.searchParams.get('artist');
  const year = url.searchParams.get('year');

  const query = `track:${track} artist:${artist} year:1900-${year}`;

  const results = (await spotify.search(query, ['track'], undefined, 5)).tracks.items;

  const earliestRelease = results?.sort((a, b) =>
    dayjs(a.album.release_date).isSameOrBefore(dayjs(b.album.release_date)) ? -1 : 1
  )[0];

  if (!earliestRelease) return Response.json({});

  return Response.json(earliestRelease);
}

import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { resolve } from "path";
import { readFileSync } from "fs";
import { supabase } from "../../../lib/supabase";
import { type Cover } from "./index.astro";
import { getReadableTitle } from "../../../helpers/helpers";
import { TAGS } from "../../../types/tags";

export const config = {
  runtime: "edge",
};

export const GET: APIRoute = async ({ params, url }) => {
  const { slug } = params;

  const { data } = await supabase
    .from("covers")
    .select(
      `
      original:original_id(name, artists, album_img),
      cover:cover_id(name, artists, album_img),
      tags`
    )
    .eq("slug", slug!!)
    .returns<Cover>()
    .single();

  if (!data) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const { original, cover, tags } = data as Cover;

  const title =
    original && cover
      ? getReadableTitle({
          originalName: original.name,
          originalArtists: original.artists,
          coverArtists: cover.artists,
        })
      : "A cover on Genderswap.fm";

  const displayTags = tags.slice(0, 4).map((tag) => TAGS[tag].label);
  tags.length > 4 ? displayTags.push(`+${tags.length - 4}`) : null;

  const albumBoxShadow =
    "0px 5.1px 2.7px rgba(0, 0, 0, 0.047), 0px 12.9px 6.9px rgba(0, 0, 0, 0.067), 0px 26.2px 14.2px rgba(0, 0, 0, 0.083), 0px 54px 29.2px rgba(0, 0, 0, 0.103), 0px 148px 80px rgba(0, 0, 0, 0.15)";

  const html = {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#1A191B",
        fontFamily: "Indivisible",
        color: "#EEEEF0",
        fontSize: "32px",
        padding: "48px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "flex-start",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "55%",
                    paddingRight: "24px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize:
                            title.length > 90
                              ? "56px"
                              : title.length > 70
                              ? "64px"
                              : title.length > 50
                              ? "72px"
                              : "80px",
                          fontWeight: 600,
                          lineHeight: 1,
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "32px",
                    width: "40%",
                  },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: original.album_img[0],
                        width: "340",
                        height: "340",
                        style: {
                          borderRadius: "8px",
                          boxShadow: albumBoxShadow,
                          transform:
                            "rotate(-8deg) scale(0.9) translateX(120px)",
                        },
                      },
                    },
                    {
                      type: "img",
                      props: {
                        src: cover.album_img[0],
                        width: "340",
                        height: "340",
                        style: {
                          borderRadius: "8px",
                          boxShadow: albumBoxShadow,
                          transform: "rotate(8deg) scale(1.1)",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "8px",
                  },
                  children: displayTags.map((tag) => ({
                    type: "div",
                    props: {
                      style: {
                        backgroundColor: "#2B292D",
                        padding: "7px 16px 8px 16px",
                        borderRadius: "40px",
                        fontSize: "24px",
                        lineHeight: 1.2,
                        marginTop: "24px",
                        color: "#B5B2BC",
                      },
                      children: tag,
                    },
                  })),
                },
              },
              {
                type: "img",
                props: {
                  src: "data:image/png;base64,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",
                  width: "168",
                  height: "96",
                  style: {
                    marginRight: "-8px",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  // const rootURL = import.meta.url;

  const indivisible = await fetch(
    new URL("/fonts/Indivisible-Regular.otf", url)
  ).then((res) => res.arrayBuffer());

  const indivisibleSemiBold = await fetch(
    new URL("/fonts/Indivisible-SemiBold.otf", url)
  ).then((res) => res.arrayBuffer());

  const svg = await satori(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Indivisible",
        data: indivisible,
        style: "normal",
        weight: 400,
      },
      {
        name: "Indivisible",
        data: indivisibleSemiBold,
        style: "normal",
        weight: 600,
      },
    ],
  });

  const png = sharp(Buffer.from(svg)).png();
  const response = await png.toBuffer();

  return new Response(response, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
};

import { useCallback, useEffect, useRef, useState } from "react";
import { CoverCard } from "./CoverCard";
import styles from "./coversGrid.module.scss";
import { supabase } from "../../lib/supabase";
import type { Tables } from "../../types/types";

// We have to redefine this type because Supabase is inferring it incorrectly
export type GridItem = {
  original: Tables<"songs">;
  cover: Tables<"songs">;
  slug: string;
};

export const CoversGrid = () => {
  const COVERS_PER_PAGE = 24;

  const [loadedCovers, setLoadedCovers] = useState<GridItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const loaderRef = useRef(null);

  const fetchCovers = useCallback(async () => {
    if (isLoading || isLast) return;

    setIsLoading(true);

    const from = index * COVERS_PER_PAGE;
    const to = from + COVERS_PER_PAGE - 1;

    try {
      const { data } = await supabase
        .from("covers")
        .select(
          `
          slug,
          original:original_id(id, name, artists, album_name, album_img),
          cover:cover_id(id, name, artists, album_name, album_img)
        `
        )
        .order("created_at", { ascending: false })
        .range(from, to)
        .returns<GridItem[]>();

      if (data) setLoadedCovers((prevCovers) => [...prevCovers, ...data]);
      setIndex((prevIndex) => prevIndex + 1);
      setIsLoading(false);

      if (!data || data.length < COVERS_PER_PAGE) {
        setIsLast(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isLoading, index]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLast) {
        fetchCovers();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchCovers]);

  // Initial load
  useEffect(() => {
    fetchCovers();
  }, []);

  return (
    <div className={styles.coversGrid}>
      {loadedCovers?.map(({ original, cover, slug }) => (
        <CoverCard
          key={slug}
          originalSongId={original.id}
          originalSongName={original.name}
          originalSongArtist={original.artists[0]}
          originalAlbumImg={original.album_img[0]}
          originalAlbumName={original.album_name}
          coverSongId={cover.id}
          coverSongArtist={cover.artists[0]}
          coverAlbumImg={cover.album_img[0]}
          coverAlbumName={cover.album_name}
          slug={slug}
        />
      ))}
      <div ref={loaderRef} className={styles.loader}>
        {isLoading && "Loading..."}
      </div>
    </div>
  );
};

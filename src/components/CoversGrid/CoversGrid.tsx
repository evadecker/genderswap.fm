import { useCallback, useEffect, useState } from "react";
import { CoverCard } from "./CoverCard";
import styles from "./coversGrid.module.scss";
import { supabase } from "../../lib/supabase";
import type { Enums, Tables } from "../../types/types";
import { CoverCardSkeleton } from "./CoverCardSkeleton";

type GridItem = {
  original: Tables<"songs">;
  cover: Tables<"songs">;
  slug: string;
};

type Props = {
  filterBy?: Enums<"tags">;
};

export const CoversGrid = ({ filterBy }: Props) => {
  const COVERS_PER_PAGE = 60;
  const SKELETON_COVERS = 12;

  const [page, setPage] = useState<number>(
    Number(new URLSearchParams(window.location.search).get("page")) || 1
  );
  const [loadedCovers, setLoadedCovers] = useState<GridItem[]>([]);
  const [range, setRange] = useState({ from: 0, to: COVERS_PER_PAGE - 1 });
  const [totalCovers, setTotalCovers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(page === 1);
  const [isLast, setIsLast] = useState(false);

  const getTotalCovers = async () => {
    const covers = supabase
      .from("covers")
      .select("id", { count: "exact", head: true });

    if (filterBy) {
      covers.overlaps("tags", [filterBy]);
    }

    const { count } = await covers;

    if (count) setTotalCovers(count);
  };

  const fetchCovers = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newFrom = (page - 1) * COVERS_PER_PAGE;
    const newTo = newFrom + COVERS_PER_PAGE - 1;

    setRange({ from: newFrom, to: newTo });

    try {
      const covers = supabase
        .from("covers")
        .select(
          `
          slug,
          original:original_id(id, name, artists, album_name, album_img),
          cover:cover_id(id, name, artists, album_name, album_img)
        `
        )
        .order("created_at", { ascending: false })
        .range(newFrom, newTo);

      if (filterBy) {
        covers.overlaps("tags", [filterBy]);
      }

      const { data } = await covers.returns<GridItem[]>();

      if (data) setLoadedCovers((prevCovers) => [...prevCovers, ...data]);
      setIsLoading(false);

      if (!data || data.length < COVERS_PER_PAGE) {
        setIsLast(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [page]);

  useEffect(() => {
    fetchCovers();
    getTotalCovers();
  }, []);

  useEffect(() => {
    setIsFirst(page === 1);
  }, [page]);

  const handleBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const newPage = page - 1;
    if (newPage === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", newPage.toString());
    }
    window.location.search = searchParams.toString();
    setPage(newPage);
  };

  const handleNext = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const newPage = page + 1;
    searchParams.set("page", newPage.toString());
    window.location.search = searchParams.toString();
    setPage(newPage);
  };

  return (
    <>
      <div className={styles.coversGrid}>
        {!loadedCovers.length &&
          [...Array(SKELETON_COVERS)].map((_) => <CoverCardSkeleton />)}
        {loadedCovers?.map(({ original, cover, slug }) => (
          <CoverCard
            originalSongName={original.name}
            originalSongArtist={original.artists[0]}
            originalAlbumImg={original.album_img[0]}
            originalAlbumName={original.album_name}
            coverSongArtist={cover.artists[0]}
            coverAlbumImg={cover.album_img[0]}
            coverAlbumName={cover.album_name}
            slug={slug}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        <div className={styles.viewingCount}>
          Viewing {range.from + 1}–{Math.min(range.to + 1, totalCovers)} of{" "}
          {totalCovers} covers
        </div>
        <div className={styles.buttons}>
          <button type="button" disabled={isFirst} onClick={handleBack}>
            Back
          </button>
          <button type="button" disabled={isLast} onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import { SongSelect } from "./SongSelect";
import { Steps, Step } from "./Steps";
import styles from "./form.module.scss";
import { type AudioFeatures, type Track } from "@spotify/web-api-ts-sdk";
import { getSongRowFromTrack } from "./getSongRowFromTrack";
import { supabase } from "../../lib/supabase";
import * as Toast from "@radix-ui/react-toast";
import toastStyles from "./toast.module.scss";

import { type Props as SongSelectProps } from "./SongSelect";

type ToastMessage = {
  title: string;
  description: string;
};

export const SubmitForm = () => {
  const [original, setOriginal] = useState<Track | null | undefined>();
  const [originalAudioFeatures, setOriginalAudioFeatures] = useState<
    AudioFeatures | null | undefined
  >();

  const [cover, setCover] = useState<Track | null | undefined>();
  const [coverAudioFeatures, setCoverAudioFeatures] = useState<
    AudioFeatures | null | undefined
  >();

  const [toastMessage, setToastMessage] = useState<ToastMessage>();

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

  const handleChangeOriginal: SongSelectProps["onChange"] = async (song) => {
    setOriginal(song);
    const audioFeatures = await getAudioFeatures(song?.id);
    setOriginalAudioFeatures(audioFeatures);
  };

  const handleChangeCover: SongSelectProps["onChange"] = async (song) => {
    setCover(song);
    const audioFeatures = await getAudioFeatures(song?.id);
    setCoverAudioFeatures(audioFeatures);
  };

  useEffect(() => {
    console.log("originalAudioFeatures", originalAudioFeatures);
    console.log("coverAudioFeatures", coverAudioFeatures);
  }, [originalAudioFeatures, coverAudioFeatures]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!original || !cover) {
      console.log("missing original or cover");
      return;
    }

    const dbObject = getSongRowFromTrack(original);
    console.log("dbObject", dbObject);

    if (dbObject) {
      const { data, error } = await supabase.from("songs").insert(dbObject);
      console.log("data", data);
      console.log("error", error);
      error &&
        setToastMessage({
          title: "Couldn't upload choices",
          description: error.message,
        });
    }
  };

  return (
    <Toast.Provider>
      <form onSubmit={handleSubmit}>
        <h1 className={styles.header}>Submit a cover</h1>
        <Steps>
          <Step title="Select the original">
            <SongSelect
              type="original"
              song={original}
              onChange={handleChangeOriginal}
            />
          </Step>
          <Step title="Select the cover">
            <SongSelect
              type="cover"
              song={cover}
              onChange={handleChangeCover}
            />
          </Step>
          <Step title="Add thoughts"></Step>
        </Steps>
        <button className={styles.submitButton} type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 16C14.2133 16 16 14.2133 16 12C16 9.78667 14.2133 8 12 8C9.78667 8 8 9.78667 8 12C8 14.2133 9.78667 16 12 16ZM12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11Z"></path>
          </svg>
          Submit
        </button>
      </form>
      {toastMessage && (
        <Toast.Root className={toastStyles.root} duration={4000}>
          <Toast.Title className={toastStyles.title}>
            {toastMessage.title}
          </Toast.Title>
          <Toast.Description className={toastStyles.description}>
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>
      )}
      <Toast.Viewport className={toastStyles.viewport} />
    </Toast.Provider>
  );
};

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
        </Steps>
        <button type="submit">Submit</button>
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

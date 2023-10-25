import { useState } from "react";
import { SongSelect } from "./SongSelect";
import { Steps, Step } from "./Steps";
import styles from "./form.module.scss";
import { type Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "../../lib/supabase";
import * as Toast from "@radix-ui/react-toast";
import toastStyles from "./toast.module.scss";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";

import type { Enums } from "../../types/types";
import { DescriptionInput } from "./DescriptionInput";
import { GenderSelect } from "./GenderSelect";
import { ContributorInput } from "./ContributorInput";
import { formatSongRow } from "./formatSongRow";
import { formatCoverRow } from "./formatCoverRow";

type ToastMessage = {
  title: string;
  description: string;
};

export type FormInput = {
  original: Track | null;
  originalGenders: Enums<"gender">[];
  cover: Track | null;
  coverGenders: Enums<"gender">[];
  description: string;
  contributor: string;
};

export const SubmitForm = () => {
  const [toastMessage, setToastMessage] = useState<ToastMessage>();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormInput>({
    defaultValues: {
      original: null,
      originalGenders: [],
      cover: null,
      coverGenders: [],
      description: "",
      contributor: window.localStorage.getItem("contributor") ?? "",
    },
  });

  const selectedOriginal = useWatch({ control, name: "original" });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const {
      original,
      originalGenders,
      cover,
      coverGenders,
      description,
      contributor,
    } = data;

    // Save name to local storage for reuse
    window.localStorage.setItem("contributor", contributor);

    if (!original || !cover) {
      return;
    }

    // Shape track data for submission to the 'songs' table
    const originalSongRow =
      original &&
      (await formatSongRow({ song: original, gender: originalGenders }));
    if (originalSongRow) {
      const res = await supabase.from("songs").insert(originalSongRow);
      res.error &&
        setToastMessage({
          title: res.error.code,
          description: res.error.message,
        });
    }

    // Shape cover data for submission to the 'songs' table
    const coverSongRow =
      cover && (await formatSongRow({ song: cover, gender: coverGenders }));
    if (coverSongRow) {
      const res = await supabase.from("songs").insert(coverSongRow);
      res.error &&
        setToastMessage({
          title: res.error.code,
          description: res.error.message,
        });
    }

    // Shape data for submission to the 'covers' table
    // Capturing the link between IDs and user contributions
    const coverRow =
      original &&
      cover &&
      (await formatCoverRow({
        original: original,
        cover: cover,
        description,
        contributor,
      }));
    if (coverRow) {
      const { data, error } = await supabase
        .from("covers")
        .insert(coverRow)
        .select("slug")
        .single();
      error &&
        setToastMessage({
          title: error.code,
          description: error.message,
        });

      // Success! Redirect :)
      if (data) {
        window.location.href = `/cover/${data.slug}`;
      }
    }

    return;
  };

  return (
    <Toast.Provider>
      <form className={styles.submitForm} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.header}>Submit a cover</h1>
        <Steps>
          <Step title="Select the original">
            <SongSelect
              name="original"
              rules={{
                required: {
                  value: true,
                  message: "Please select a song",
                },
              }}
              control={control}
            />
            <GenderSelect
              name="originalGenders"
              control={control}
              rules={{ required: true }}
            />
          </Step>
          <Step title="Select the cover">
            <SongSelect
              name="cover"
              rules={{
                required: {
                  value: true,
                  message: "Please select a song",
                },
                validate: (value) =>
                  (selectedOriginal &&
                    (value as Track).id !== selectedOriginal.id) ||
                  "Cover cannot be the same as the original",
              }}
              control={control}
            />
            <GenderSelect
              name="coverGenders"
              control={control}
              rules={{ required: true }}
            />
          </Step>
          <Step title="Add thoughts">
            <DescriptionInput control={control} />
            <ContributorInput control={control} />
          </Step>
        </Steps>
        <button
          disabled={isSubmitting}
          className={styles.submitButton}
          type="submit"
        >
          {isSubmitting ? (
            <svg
              className={styles.spinner}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M12 3C16.9706 3 21 7.02944 21 12H19C19 8.13401 15.866 5 12 5V3Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M52.2714 2.22862C47.9497 1.31 43.7016 4.06877 42.783 8.3905L32.4014 57.2319L7.97922 62.423C3.65749 63.3416 0.898719 67.5898 1.81733 71.9115L11.7971 118.863C12.7157 123.184 16.9638 125.943 21.2856 125.024L68.2366 115.045C72.5584 114.126 75.3171 109.878 74.3985 105.556L72.0159 94.3467L102.861 100.903C107.183 101.822 111.431 99.063 112.35 94.7412L126.904 26.2709C127.822 21.9492 125.063 17.701 120.742 16.7824L52.2714 2.22862ZM72.0159 94.3467L64.4188 58.6051C63.5002 54.2834 59.252 51.5246 54.9303 52.4432L32.4014 57.2319L28.2291 76.8608C27.3105 81.1826 30.0693 85.4307 34.391 86.3493L72.0159 94.3467Z"
              />
            </svg>
          )}
          Submit
        </button>
      </form>
      <Toast.Root
        open={!!toastMessage}
        className={toastStyles.root}
        duration={4000}
      >
        <Toast.Title className={toastStyles.title}>
          {toastMessage?.title}
        </Toast.Title>
        <Toast.Description className={toastStyles.description}>
          {toastMessage?.description}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className={toastStyles.viewport} />
    </Toast.Provider>
  );
};

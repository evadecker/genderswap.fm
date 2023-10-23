import { useState } from "react";
import { SongSelect } from "./SongSelect";
import { Steps, Step } from "./Steps";
import styles from "./form.module.scss";
import { type Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "../../lib/supabase";
import * as Toast from "@radix-ui/react-toast";
import toastStyles from "./toast.module.scss";
import { useForm, type SubmitHandler, get } from "react-hook-form";

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
      contributor: "",
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const {
      original,
      originalGenders,
      cover,
      coverGenders,
      description,
      contributor,
    } = data;

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.header}>Submit a cover</h1>
        <Steps>
          <Step title="Select the original">
            <SongSelect
              name="original"
              rules={{ required: true }}
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
              rules={{ required: true }}
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
            >
              <path d="M12 3C16.9706 3 21 7.02944 21 12H19C19 8.13401 15.866 5 12 5V3Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 16C14.2133 16 16 14.2133 16 12C16 9.78667 14.2133 8 12 8C9.78667 8 8 9.78667 8 12C8 14.2133 9.78667 16 12 16ZM12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11Z"></path>
            </svg>
          )}
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

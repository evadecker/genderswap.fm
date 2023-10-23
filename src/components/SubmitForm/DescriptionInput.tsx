import { useWatch, useController, type Control } from "react-hook-form";
import { type FormInput } from "./SubmitForm";
import classNames from "classnames";
import { getMaxCharacterHelpText } from "../../helpers/helpers";
import styles from "./input.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import * as Label from "@radix-ui/react-label";

const MAX_DESCRIPTION_CHARS = 160;

type Props = {
  control: Control<FormInput>;
};

export const DescriptionInput = ({ control }: Props) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: "description",
    control,
    rules: { maxLength: MAX_DESCRIPTION_CHARS },
  });
  const description = useWatch({
    control,
    name: "description",
    defaultValue: "",
  }) as string;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Prevent newlines
    if (event.key === "Enter") {
      event.preventDefault();
    }

    // Prevent leading spaces
    if (description.length === 0 && event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Label.Root htmlFor="description" className={styles.label}>
        Description <span className={styles.optional}>optional</span>
      </Label.Root>
      <TextareaAutosize
        id="description"
        className={styles.input}
        minRows={2}
        maxRows={4}
        onKeyDown={handleKeyDown}
        placeholder="Classic ABBA pop melts into acoustic-led gay heartbreak."
        {...field}
      />
      <div
        className={classNames(styles.helpText, {
          [styles.warning]: description.length > MAX_DESCRIPTION_CHARS,
        })}
      >
        {getMaxCharacterHelpText(description, MAX_DESCRIPTION_CHARS)}
      </div>
    </div>
  );
};

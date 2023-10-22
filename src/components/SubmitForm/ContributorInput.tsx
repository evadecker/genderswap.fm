import { useWatch, useController, type Control } from "react-hook-form";
import { type FormInput } from "./SubmitForm";
import classNames from "classnames";
import { getMaxCharacterHelpText } from "../../helpers/helpers";
import styles from "./input.module.scss";
import * as Label from "@radix-ui/react-label";

const MAX_CONTRIBUTOR_CHARS = 50;

type Props = {
  control: Control<FormInput>;
};

export const ContributorInput = ({ control }: Props) => {
  const { field } = useController({
    name: "contributor",
    control,
    rules: { maxLength: MAX_CONTRIBUTOR_CHARS },
  });
  const contributor = useWatch({
    control,
    name: "contributor",
    defaultValue: "",
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Prevent leading spaces
    if (contributor.length === 0 && event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Label.Root htmlFor="contributor" className={styles.label}>
        Your first name <span className={styles.optional}>optional</span>
      </Label.Root>
      <input
        id="contributor"
        className={styles.input}
        onKeyDown={handleKeyDown}
        placeholder="Agnetha"
        {...field}
      />
      <div
        className={classNames(styles.helpText, {
          [styles.warning]: contributor.length > MAX_CONTRIBUTOR_CHARS,
        })}
      >
        {getMaxCharacterHelpText(contributor, MAX_CONTRIBUTOR_CHARS)}
      </div>
    </div>
  );
};

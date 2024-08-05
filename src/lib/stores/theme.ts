import { browser } from "$app/environment";
import { writable } from "svelte/store";

type Theme = "light" | "dark";

let initialTheme: Theme = "light";

if (browser) {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
  const defaultValue: Theme = prefersDarkMode.matches ? "dark" : "light";
  initialTheme =
    (window.localStorage.getItem("theme") as Theme) ?? defaultValue;
}

export const theme = writable<Theme>(initialTheme);

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem("theme", value);
    document.body.classList.toggle("dark", value === "dark");
  }
});

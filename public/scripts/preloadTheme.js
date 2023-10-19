function getUserPreference() {
  if (window.localStorage.getItem("theme")) {
    return window.localStorage.getItem("theme");
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const setTheme = () => {
  const userPreference = getUserPreference();
  document.body.classList.remove("light", "dark");
  document.body.classList.add(userPreference);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme !== null)
    metaTheme.setAttribute(
      "content",
      userPreference === "dark" ? "#121113" : "#FDFCFD"
    );

  window.localStorage.setItem("theme", userPreference);
};

setTheme();

// Update body class after swap
document.addEventListener("astro:after-swap", setTheme);

document.addEventListener(
  "astro:page-load",
  () => {
    const lightToggle = document.querySelector("[data-theme-toggle-light]");
    const darkToggle = document.querySelector("[data-theme-toggle-dark]");

    const userPreference = getUserPreference();

    // Update class on toggle
    if (userPreference === "light") {
      lightToggle?.classList.add("active");
      darkToggle?.classList.remove("active");
    } else {
      lightToggle?.classList.remove("active");
      darkToggle?.classList.add("active");
    }
  },
  { once: true }
);

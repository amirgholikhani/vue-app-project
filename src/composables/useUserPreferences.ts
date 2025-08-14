import { ref, watch } from "vue";

export function useUserPreferences() {
  const theme = ref(localStorage.getItem("theme") || "light");
  const fontSize = ref(localStorage.getItem("fontSize") || "medium");

  watch(theme, (newTheme) => {
    localStorage.setItem("theme", newTheme);
  })

  watch(fontSize, (newFontSize) => {
    localStorage.setItem("fontSize", newFontSize);
  })

  return { theme, fontSize };
}
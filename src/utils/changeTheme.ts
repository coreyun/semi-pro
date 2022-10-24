export default function changeTheme(theme) {
  if (theme === "dark") {
    document.body.setAttribute("theme-mode", "dark");
  } else {
    document.body.removeAttribute("theme-mode");
  }
}

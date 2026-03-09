export const Screen = Object.freeze({
  HOME: "home",
  LOGIN: "login",
  REGISTER: "register",
  DASHBOARD: "dashboard",
  FEED: "feed",
  PROFILE: "profile"
});

export function hashForScreen(screen) {
  if (screen === Screen.FEED) return "#feed";
  if (screen === Screen.PROFILE) return "#profile";
  if (screen === Screen.DASHBOARD) return "#dashboard";
  if (screen === Screen.REGISTER) return "#register";
  if (screen === Screen.LOGIN) return "#login";
  return "#home";
}

export function screenFromHash(hash) {
  const normalized = hash.replace(/^#\/?/, '#');
  if (normalized === "#feed") return Screen.FEED;
  if (normalized === "#profile") return Screen.PROFILE;
  if (normalized === "#dashboard") return Screen.DASHBOARD;
  if (normalized === "#register") return Screen.REGISTER;
  if (normalized === "#login") return Screen.LOGIN;
  return Screen.HOME;
}


import Cookies from "js-cookie";

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set("access_token", accessToken);

    Cookies.set("refresh_token", refreshToken);
  },

  clear() {
    Cookies.remove("access_token");

    Cookies.remove("refresh_token");
  },

  getAccessToken() {
    return Cookies.get("access_token");
  },

  getRefreshToken() {
    return Cookies.get("refresh_token");
  },
};

import { api } from "./client";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return data;
  },

  me: async () => {
    const { data } = await api.get("/auth/me");

    return data;
  },

  logout: async () => {
    return await api.delete("auth/logout");
  },
};

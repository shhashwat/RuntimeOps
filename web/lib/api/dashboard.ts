import { api } from "./client";

export const dashboardApi = {
  metrics: async () => {
    const { data } = await api.get("/metrics");
    return data;
  },

  health: async () => {
    const { data } = await api.get("/health");
    return data;
  },

  activities: async () => {
    const { data } = await api.get("/activities");
    return data;
  },
};

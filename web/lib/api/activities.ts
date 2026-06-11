import { api } from "./client";

export const activitiesApi = {
  getActivities: async () => {
    const { data } = await api.get("/activities");

    return data;
  },
};

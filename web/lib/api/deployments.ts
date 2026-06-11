import { api } from "./client";

export const deploymentsApi = {
  getDeployments: async () => {
    const { data } = await api.get("/deployments");
    return data;
  },

  getDeployment: async (id: string) => {
    const { data } = await api.get(`/deployments/${id}`);
    return data;
  },

  getDeploymentLogs: async (id: string) => {
    const { data } = await api.get(`/deployments/${id}/logs`);
    return data;
  },

  triggerDeployment: async (projectId: string) => {
    const { data } = await api.post(`/deployments/${projectId}`);
    return data;
  },
};

import { api } from "./client";

export const projectsApi = {
  getProjects: async () => {
    const { data } = await api.get("/projects");

    return data;
  },

  getProject: async (id: string) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  createProject: async (payload: {
    name: string;
    repoUrl: string;
    environment: string;
    deploymentStrategy: string;
  }) => {
    const { data } = await api.post("/projects", payload);

    return data;
  },

  updateProject: async (
    id: string,
    payload: {
      name: string;
      repoUrl: string;
      environment: string;
    },
  ) => {
    const { data } = await api.patch(`/projects/${id}`, payload);

    return data;
  },

  deleteProject: async (id: string) => {
    console.log(id);
    const { data } = await api.delete(`/projects/${id}`);

    return data;
  },
};

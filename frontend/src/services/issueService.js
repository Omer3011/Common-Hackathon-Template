import api from "./api";

export const createIssue = async (payload) => {
  const { data } = await api.post("/issue", payload);
  return data;
};

export const getIssues = async () => {
  const { data } = await api.get("/issues");
  return data;
};

export const updateIssueStatus = async (id, status) => {
  const { data } = await api.patch(`/issue/${id}`, { status });
  return data;
};

export const assignIssue = async (id, assignedTo, deadline) => {
  const { data } = await api.patch(`/assign/${id}`, { assignedTo, deadline });
  return data;
};

export const joinIssue = async (id) => {
  const { data } = await api.post(`/issue/${id}/join`);
  return data;
};

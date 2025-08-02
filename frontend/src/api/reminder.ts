import axiosClient from "./axiosClient";

export interface Reminder {
  _id: string;
  title: string;
  description?: string;
  time: string;
}

export const getReminders = async (): Promise<Reminder[]> => {
  const res = await axiosClient.get("/reminders");
  return res.data.data;
};

export const createReminder = async (data: {
  title: string;
  description?: string;
  time: string;
}) => {
  const res = await axiosClient.post("/reminders", data);
  return res.data.data;
};

export const updateReminder = async (
  id: string,
  data: Partial<{ title: string; description: string; time: string }>
) => {
  const res = await axiosClient.put(`/reminders/${id}`, data);
  return res.data.data;
};

export const deleteReminder = async (id: string) => {
  await axiosClient.delete(`/reminders/${id}`);
};

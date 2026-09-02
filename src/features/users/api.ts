import { apiClient } from "@/lib/api-client";

import { userListSchema } from "./types";

export async function fetchUsers() {
  const { data } = await apiClient.get("/users");
  return userListSchema.parse(data);
}

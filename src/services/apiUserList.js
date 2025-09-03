import { getCurrentUser } from "./apiAuth";
import supabase from "./supabase";

export async function addToUserList({
  list_type = "completed",
  value,
  type = "movie",
}) {
  const list_id = await getUserTableIdByListType(list_type);
  const { data, error } = await supabase
    .from("items")
    .insert([{ list_id, value, type }])
    .select();
  if (error) throw error;
  return data;
}

export async function getUserTableIdByListType(list_type) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Error while fetching current user");
  const { data: list_ids, error } = await supabase
    .from("lists")
    .select("list_id")
    .filter("owner_id", "eq", user.id)
    .filter("list_type", "eq", list_type);
  if (error) throw error;
  if (!list_ids.length) return null;
  return list_ids[0]?.list_id;
}

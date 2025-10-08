import supabase from "./supabase";

export async function getUsersRecommendations({ user_id, ascending = false }) {
  const { data, error } = await supabase
    .from("items")
    .select(
      `*,list:items_list_id_fkey!inner(list_id,list_name,recommended_to,owner_id,owner:profiles!lists_owner_id_fkey1(*))`,
    )
    .eq("list.recommended_to", user_id)
    .order("created_at", { ascending });
  if (error) throw error;
  return data;
}

export async function addToUserList({
  list_type = "completed",
  value,
  type = "movie",
  user_id,
}) {
  const list_id = await getUserTableIdByListType(user_id, list_type);
  const { data, error } = await supabase
    .from("items")
    .insert([{ list_id, value, type }])
    .select();
  if (error) throw error;
  return data;
}

export async function deleteItemFromUserList({
  list_type = "completed",
  value,
  user_id,
}) {
  const list_id = await getUserTableIdByListType(user_id, list_type);
  const { data, error } = await supabase
    .from("items")
    .delete()
    .eq("value", value)
    .eq("list_id", list_id);
  if (error) throw error;
  return data;
}

export async function getUserListsByItem({ user_id, item, type = "movie" }) {
  const { data, error } = await supabase
    .from("lists")
    .select("list_type,items!inner()")
    .eq("items.value", item)
    .eq("items.type", type)
    .eq("owner_id", user_id)
    .in("list_type", ["watchlist", "favourite", "completed"]);
  // .eq("lists.list_type", "completed");
  // .eq("lists.owner_id", user_id);
  if (error) throw error;

  return data.map((list) => list.list_type);
}

export async function getUserTableIdByListType(user_id, list_type) {
  // const user = await getCurrentUser();
  if (!user_id) throw new Error("no user id found");
  const { data: list_ids, error } = await supabase
    .from("lists")
    .select("list_id")
    .filter("owner_id", "eq", user_id)
    .filter("list_type", "eq", list_type);
  if (error) throw error;
  if (!list_ids.length) return null;
  return list_ids[0]?.list_id;
}

export async function insertItemsFromListIds({
  value,
  type = "movie",
  listIds,
}) {
  console.log(listIds);
  if (!listIds.length) return;
  const payload = listIds.map((list_id) => {
    return { value, type, list_id };
  });
  const { data, error } = await supabase.from("items").insert(payload).select();
  if (error) throw error;
  return data;
}

export async function getListById({ list_id, ascending = false }) {
  if (!list_id) return;
  const { data, error } = await supabase
    .from("lists")
    .select(
      `*,items(*),owner_profile:profiles!lists_owner_id_fkey1(
        id,
        username,
        full_name,
        avatar_url
      )`,
    )
    .eq("list_id", list_id)
    .order("created_at", { referencedTable: "items", ascending });
  if (error) throw error;
  if (data.length < 1) return [];
  return data[0];
}
export async function getUserLists({ user_id }) {
  const { data, error } = await supabase
    .from("lists")
    .select()
    .neq("list_type", "recommendation")
    .eq("owner_id", user_id);
  if (error) throw error;
  if (data.length < 1) return [];
  return data;
}
export async function getCustomUserLists({ user_id }) {
  const { data, error } = await supabase
    .from("lists")
    .select()
    .eq("list_type", "custom")
    .eq("owner_id", user_id);
  if (error) throw error;
  if (data.length < 1) return [];
  return data;
}

export async function getItemInList({ item, type = "movie", lists }) {
  const { data: res, error } = await supabase
    .from("items")
    .select("*")
    .eq("value", item)
    .eq("type", type)
    .in(
      "list_id",
      lists.map((list) => list.list_id),
    );
  if (error) throw error;
  const data = lists.map((list) => {
    const isExists = res.some((val) => val.list_id === list.list_id);
    return { ...list, isExists };
  });
  return data;
}

export async function deleteItemFromList({ item, list_id }) {
  const { error } = await supabase
    .from("items")
    .delete({ count: 1 })
    .eq("value", item)
    .eq("list_id", list_id);
  if (error) throw error;
  return true;
}
export async function deleteItemUsingId({ item_id }) {
  const { error } = await supabase
    .from("items")
    .delete({ count: 1 })
    .eq("id", item_id);
  if (error) throw error;
  return true;
}
export async function createList({ visibility, list_name, owner_id }) {
  const { data, error } = await supabase
    .from("lists")
    .insert([{ owner_id, list_name, list_type: "custom", visibility }])
    .select();
  if (error) throw error;
  return data;
}
export async function updateList({ list_name, visibility, list_id }) {
  if (!list_name && !visibility) return;
  let payload = {};
  if (list_name) payload.list_name = list_name;
  if (visibility) payload.visibility = visibility;
  const { error } = await supabase
    .from("lists")
    .update(payload)
    .eq("list_id", list_id);
  if (error) throw error;
  return true;
}
export async function deleteList({ list_id }) {
  if (!list_id) return;
  const { error } = await supabase
    .from("lists")
    .delete()
    .eq("list_id", list_id);
  if (error) throw error;
  return true;
}
//lists_owner_id_fkey1

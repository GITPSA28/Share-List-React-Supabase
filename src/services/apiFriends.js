import supabase from "./supabase";

export async function sendFriendRequest(user_id, friend_id) {
  const { data, error } = await supabase
    .from("friends")
    .insert([{ user_id, friend_id }])
    .select();
  if (error) throw error;
  return data[0];
}
export async function getFriendStatus(user_id, friend_id) {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(
      `and(user_id.eq.${user_id},friend_id.eq.${friend_id}) , and(user_id.eq.${friend_id},friend_id.eq.${user_id}) `,
    );
  if (error) throw error;
  if (!data.length) return null;
  return data[0];
}

export async function acceptFriendRequest(user_id, friend_id) {
  const { data, error } = await supabase
    .from("friends")
    .update({ status: "accept" })
    .eq("user_id", friend_id)
    .eq("friend_id", user_id)
    .select();
  if (error) throw error;
  if (!data.length) return null;
  return data[0];
}

export async function rejectFriendRequest(user_id, friend_id) {
  const { data, error } = await supabase
    .from("friends")
    .delete()
    .or(
      `and(user_id.eq.${user_id},friend_id.eq.${friend_id}),and(user_id.eq.${friend_id},friend_id.eq.${user_id})`,
    );
  if (error) throw error;
  return data;
}

export async function getFriendsDetails(user_id, status) {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `*,
        user:profiles!friends_user_id_fkey1 (
        id,
        username,
        full_name,
        avatar_url
        ),
        friend:profiles!friends_friend_id_fkey1 (
        id,
        username,
        full_name,
        avatar_url
        )
    `,
    )
    .eq("status", status)
    .or(`user_id.eq.${user_id},friend_id.eq.${user_id}`);

  if (error) throw error;
  console.log(data);
  if (!data.length) return null;
  const friends = data.map((res) => {
    if (res.user_id === user_id) return res.friend;
    return res.user;
  });
  return friends;
}

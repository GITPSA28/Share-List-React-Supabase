import supabase from "./supabase";

export async function getUserProfileData({ id }) {
  if (!id) {
    console.log("working");
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;
    id = session.user.id;
    // const { data: userData, error } = await supabase.auth.getUser();
    // id = userData.user.id;
    console.log(id);
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (data.length < 1) throw new Error("No data");
  return data[0];
}

export async function checkUsernameExists({ input }) {
  if (!input) return;
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", input);
  if (error) throw new Error(error.message);
  return data.length > 0;
}

export async function updateUserProfile({ username, theme }) {
  let updateData;
  if (username) updateData = { username };
  if (theme) updateData = { ...updateData, theme };
  const { data: userData, error: sessionError } = await supabase.auth.getUser();
  if (sessionError) throw sessionError;
  let id = userData.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;
  console.log(data);
  return data[0];
}

export async function searchUsers(input) {
  if (!input) return;
  console.log("input", input);
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", `%${input}%`)
    .range(0, 9);
  if (error) throw new Error(error.message);
  return profiles;
}

export async function getUserProfileDataByUserName({ username }) {
  console.log("working");
  console.log(username);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username);
  if (error) throw new Error(error.message);
  if (data.length < 1) throw new Error("No data");
  return data[0];
}

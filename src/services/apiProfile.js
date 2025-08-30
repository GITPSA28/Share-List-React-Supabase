import supabase from "./supabase";

export async function getUserProfileData({ id }) {
  console.log("working");
  if (!id) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;
    const { data: userData, error } = await supabase.auth.getUser();
    id = userData.user.id;
  }
  console.log(id);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (data.length < 1) throw new Error("No data");
  return data[0];
}

export async function checkUsernameExists({ input }) {
  console.log("working");
  // if (!id) {
  //   const { data: session } = await supabase.auth.getSession();
  //   if (!session.session) return null;
  //   const { data: userData, error } = await supabase.auth.getUser();
  //   id = userData.user.id;
  // }
  // console.log(id);
  if (!input) return;
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", input);
  if (error) throw new Error(error.message);
  return data.length > 0;
}

export async function updateUserProfile({ username }) {
  let updateData;
  if (username) updateData = { data: { username } };
  const { data: userData, error: sessionError } = await supabase.auth.getUser();
  if (sessionError) throw sessionError;
  let id = userData.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .update({ username: username })
    .eq("id", id)
    .select();

  if (error) throw error;
  console.log(data);
  return data;
}

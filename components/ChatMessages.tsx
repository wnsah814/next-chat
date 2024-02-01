import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import InitMessages from "@/lib/store/InitMessages";

export default async function ChatMessages() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from("messages").select("*,users(*)");

  // console.log(data);

  return (
    <Suspense fallback={"loading.."}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}

import ChatHeader from "@/components/ChatHeader";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getSession();

  console.log(data.session?.user);

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md">
        <ChatHeader user={data.session?.user}/>
      </div>
    </div>
  );
}

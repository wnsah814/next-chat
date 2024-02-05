"use client";
import React from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setoptimisticIds = useMessage((state) => state.setoptimisticIds);
  const supabase = createClient();

  const handleSendMessage = async (text: string) => {
    if (text.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }
    const newMessage = {
      id: uuidv4(),
      text,
      send_by: user?.id,
      is_edit: false,
      created_at: new Date().toISOString(),
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.user_name,
      },
    };

    addMessage(newMessage as Imessage);
    setoptimisticIds(newMessage.id);
    const { error } = await supabase.from("messages").insert({ text });

    if (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}

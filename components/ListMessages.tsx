"use client";
import { useMessage } from "@/lib/store/messages";
import React from "react";
import Message from "./Message";
import { DeleteAlert } from "./MessageActions";

export default function ListMessages() {
  const message = useMessage((state) => state.messages);

  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
      <div className="flex-1"></div>
      <div className="space-y-7">
        {message.map((v, idx) => (
          <Message key={idx} message={v}/>
        ))}
      </div>
      <DeleteAlert />
    </div>
  );
}

import { create } from "zustand";

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  addMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (updateMessage: Imessage) => void;
  setoptimisticIds: (id: string) => void;
}

export const useMessage = create<MessageState>((set) => ({
  messages: [],
  optimisticIds: [],
  actionMessage: undefined,
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
      optimisticIds: [...state.optimisticIds, newMessage.id],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    })),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => ({
      messages: state.messages.filter((message) => {
        if (message.id === updateMessage.id) {
          (message.text = updateMessage.text),
            (message.is_edit = updateMessage.is_edit);
        }
        return message;
      }),
    })),
  setoptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
}));

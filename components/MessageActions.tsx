"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRef } from "react";

export function DeleteAlert() {
  const actionMessage = useMessage((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  );
  const handleDeleteMessage = async () => {
    const supabase = createClient();
    optimisticDeleteMessage(actionMessage?.id!);
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully delete the message");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const actionMessage = useMessage((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessage(
    (state) => state.optimisticUpdateMessage
  );
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleEditMessage = async () => {
    const supabase = createClient();
    const text = inputRef.current.value.trim();
    if (text) {
      optimisticUpdateMessage({
        ...actionMessage,
        text,
        is_edit: true,
      } as Imessage);
      const { error } = await supabase
        .from("messages")
        .update({ text, is_edit: true })
        .eq("id", actionMessage?.id!);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Update Successfully");
      }
      document.getElementById("trigger-edit")?.click();
    } else {
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-delete")?.click();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Input id="name" defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" onClick={handleEditMessage}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

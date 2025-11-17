import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { settingsApi } from "src/api/settings";
import { useGetReminders } from "src/hooks/swr/use-settings";

export const useReminders = () => {
  const { reminders, mutate, isLoading } = useGetReminders();
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [reminderToEdit, setReminderToEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const unread = useMemo(() => {
    return reminders?.filter((item)=> !item?.closed)?.length;
  }, [reminders]);

  const handleOpenDeleteReminder = useCallback((reminderId) => {
    setReminderToDelete(reminderId);
    setOpenDelete(true);
  }, []);

  const handleOpenEditReminder = useCallback((reminder) => {
    setReminderToEdit(reminder);
    setOpenEdit(true);
  }, []);

  const handleRemoveOne = useCallback(async () => {
    setIsDeleteLoading(true);
    try {
      await settingsApi.deleteReminder(reminderToDelete);
      toast.success("Reminder successfully removed!");
      mutate();
      setReminderToDelete(null);
      setOpenDelete(false);
    } catch (error) {
      setOpenDelete(false);
      setReminderToDelete(null);
      toast.error(error?.response?.data?.message);
    }
    setIsDeleteLoading(false);
  }, [mutate, reminderToDelete]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsDeleteLoading(true);
    try {
      await settingsApi.deleteAllReminder({ read_all : true });
      toast.success("Reminder successfully removed!");
      mutate();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    } finally {
      setReminderToDelete(null);
      setOpenDelete(false);
    }
    setIsDeleteLoading(false);
  }, []);

  const handleUpdateOne = useCallback(
    async (data) => {
      try {
        await settingsApi.updateReminder(reminderToEdit?.id, {
          ...data,
          ticket_id: reminderToEdit?.internal_ticket_id,
          client_id: reminderToEdit?.client_id,
        });
        toast.success("Reminder successfully updated!");
        mutate();
        setReminderToEdit(null);
        setOpenEdit(false);
      } catch (error) {
        setOpenEdit(false);
        setReminderToEdit(null);
        if( error?.response?.data?.message?.includes(`Couldn't find Reminder with 'id`) ) {
          toast.error("You cannot update this reminder because it was created by another user.");
        } else {
          toast.error(error?.response?.data?.message);
        }
      }
    },
    [mutate, reminderToEdit]
  );

  return {
    handleMarkAllAsRead,
    handleRemoveOne,
    openDelete,
    openEdit,
    setOpenEdit,
    setOpenDelete,
    handleOpenDeleteReminder,
    handleOpenEditReminder,
    reminders,
    unread,
    reminderToEdit,
    handleUpdateOne,
    handleRemindersGet: mutate,
    isLoading,
    isDeleteLoading,
    reminderToDelete,
  };
};

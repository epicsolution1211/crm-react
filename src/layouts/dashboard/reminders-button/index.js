import { useEffect, useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { EditReminderModal } from "./reminder-edit";
import { RemindersPopover } from "./reminders-popover";
import { useTimezone } from "src/hooks/use-timezone";
import { usePopover } from "src/hooks/use-popover";
import { useReminders } from "src/hooks/overview/use-reminders";
import { SimpleTaskDrawer } from "src/sections/dashboard/todo/todo-detail-drawer";

export const RemindersButton = () => {
  const popover = usePopover();
  const {
    handleRemoveOne,
    handleMarkAllAsRead,
    isDeleteLoading,
    reminderToDelete,
    reminders,
    unread,
    openDelete,
    openEdit,
    setOpenEdit,
    setOpenDelete,
    handleOpenDeleteReminder,
    handleOpenEditReminder,
    reminderToEdit,
    handleUpdateOne,
    handleRemindersGet,
  } = useReminders();
  const { toLocalTime } = useTimezone();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const formattedReminder = useMemo(() => {
    if (reminderToEdit) {
      return {
        ...reminderToEdit,
        time: toLocalTime(reminderToEdit?.time)
      };
    }
    return null;
  }, [reminderToEdit]);

  useEffect(() => {
    if (popover.open) handleRemindersGet();
  }, [popover.open]);

  return (
    <>
      <Tooltip title="Reminders">
        <IconButton
          ref={popover.anchorRef}
          onClick={popover.handleOpen}
          sx={{ '&:hover': { color: 'primary.main' }}}
          >
          <Badge
            color="error"
            badgeContent={unread}>
            <Iconify icon="line-md:calendar" width={26}
          />
          </Badge>
        </IconButton>
      </Tooltip>
      <RemindersPopover
        anchorEl={popover.anchorRef.current}
        reminders={reminders}
        onClose={popover.handleClose}
        onMarkAllAsRead={handleOpenDeleteReminder}
        onRemoveOne={handleOpenDeleteReminder}
        onEditOne={handleOpenEditReminder}
        open={popover.open}
        onOpenTask={(id) => {
          popover.handleClose();
          setTimeout(() => {
            setSelectedTaskId(id);
          }, 100);
        }}
      />
      <DeleteModal
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        title="Are you sure you want to delete reminder?"
        onDelete={()=> {
          if(reminderToDelete =='all') {
            handleMarkAllAsRead();
          } else {
            handleRemoveOne();
          }
        }}
        isLoading={isDeleteLoading}
      />
      <EditReminderModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        reminder={formattedReminder}
        onUpdateReminder={handleUpdateOne}
      />

      {selectedTaskId && (
        <SimpleTaskDrawer
          open={!!selectedTaskId}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  );
};

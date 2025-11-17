import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CalendarContainer } from 'src/sections/dashboard/calendar/calendar-container';
import { CalendarEventDialog } from 'src/sections/dashboard/calendar/calendar-event-dialog';
import { CalendarToolbar } from 'src/sections/dashboard/calendar/calendar-toolbar';
import { EditReminderModal } from 'src/layouts/dashboard/reminders-button/reminder-edit';
import { LazyFullCalendar } from 'src/components/lazy-fullcalendar';
import { ReminderAISummary } from 'src/sections/dashboard/calendar/calendar-ai-summary';
import { Seo } from 'src/components/seo';
import { useTimezone } from "src/hooks/use-timezone";
import { paths } from "src/paths";
import { settingsApi } from 'src/api/settings';
import { thunks } from 'src/thunks/calendar';
import { useAuth } from "src/hooks/use-auth";
import { useDialog } from 'src/hooks/use-dialog';
import { useDispatch, useSelector } from 'src/store';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from "src/hooks/use-router";

// Utility functions to calculate date ranges based on view
const getDateRangeForView = (date, view) => {
  const currentDate = new Date(date);
  
  switch (view) {
    case 'dayGridMonth': {
      // Month view: start of month to end of month
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
      return {
        start_date: format(start, "yyyy-MM-dd HH:mm:ss"),
        end_date: format(end, "yyyy-MM-dd HH:mm:ss")
      };
    }
    
    case 'timeGridWeek':
    case 'listWeek': {
      // Week view: start of week to end of week
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      
      return {
        start_date: format(start, "yyyy-MM-dd HH:mm:ss"), 
        end_date: format(end, "yyyy-MM-dd HH:mm:ss")
      };
    }
    
    case 'timeGridDay':
    case 'listDay': {
      // Day view: start of day to end of day
      const start = startOfDay(currentDate);
      const end = endOfDay(currentDate);
      
      return {
        start_date: format(start, "yyyy-MM-dd HH:mm:ss"),
        end_date: format(end, "yyyy-MM-dd HH:mm:ss")
      };
    }
    
    default: {
      // Default to current month
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
      return {
        start_date: format(start, "yyyy-MM-dd HH:mm:ss"),
        end_date: format(end, "yyyy-MM-dd HH:mm:ss")
      };
    }
  }
};

const useEvents = (date, view) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.calendar.events);

  const { toLocalTime } = useTimezone();

  const formattedEvents = useMemo(() => {
    return events?.map((event) => {
      // Convert UTC time to local time with offset
      const localTime = toLocalTime(event.time);
      
      // Format the event for display
      return {
        ...event,
        time: localTime,
        time_date: format(new Date(localTime), "yyyy-MM-dd"),
        time_hour: format(new Date(localTime), "HH"),
        time_minute: format(new Date(localTime), "mm"),
        // Add required fields for FullCalendar
        start: localTime,
        end: localTime,
        title: event.description || 'No description',
        // Keep original data in extendedProps
        extendedProps: {
          internal_ticket_id: event.internal_ticket_id,
          client_id: event.client_id,
          description: event.description
        }
      };
    });
  }, [events]);

  const handleEventsGet = useCallback(() => {
    const dateRange = getDateRangeForView(date, view);
    const params = {
      ...dateRange,
      per_page: 1000
    };
    dispatch(thunks.getEvents(params));
  }, [dispatch, date, view]);

  useEffect(() => {
    handleEventsGet();
  }, [handleEventsGet]);

  return { events: formattedEvents, handleEventsGet };
};

const useCurrentEvent = (events, dialogData) => {
  return useMemo(() => {
    if (!dialogData) {
      return undefined;
    }

    return events.find((event) => event.id == dialogData.eventId);
  }, [dialogData, events]);
};

const Page = () => {
  const calendarRef = useRef(null);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(mdUp ? 'timeGridDay' : 'dayGridMonth');
  const { user } = useAuth();
  const { events, handleEventsGet } = useEvents(date, view);
  const createDialog = useDialog();
  const updateDialog = useDialog();
  const updatingEvent = useCurrentEvent(events, updateDialog.data);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_calendar === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  usePageView();

  const handleScreenResize = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          const newView = mdUp ? 'dayGridMonth' : 'timeGridDay';
          calendarApi.changeView(newView);
          setView(newView);
        }
      } catch (error) {
        console.warn('Error accessing calendar API:', error);
      }
    }
  }, [calendarRef, mdUp]);

  useEffect(() => {
    handleScreenResize();
  },

    [mdUp]);

  // Refresh events when date or view changes
  useEffect(() => {
    handleEventsGet();
  }, [date, view, handleEventsGet]);

  const handleViewChange = useCallback((view) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          calendarApi.changeView(view);
          setView(view);
        }
      } catch (error) {
        console.warn('Error changing calendar view:', error);
      }
    }
  }, []);

  const handleDateToday = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          calendarApi.today();
          setDate(calendarApi.getDate());
        }
      } catch (error) {
        console.warn('Error navigating to today:', error);
      }
    }
  }, []);

  const handleDatePrev = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          calendarApi.prev();
          setDate(calendarApi.getDate());
        }
      } catch (error) {
        console.warn('Error navigating to previous:', error);
      }
    }
  }, []);

  const handleDateNext = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          calendarApi.next();
          setDate(calendarApi.getDate());
        }
      } catch (error) {
        console.warn('Error navigating to next:', error);
      }
    }
  }, []);

  const handleAddClick = useCallback(() => {
    createDialog.handleOpen();
  }, [createDialog]);

  const handleRangeSelect = useCallback((arg) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      try {
        const calendarApi = calendarEl.getApi();
        if (calendarApi) {
          calendarApi.unselect();
        }
      } catch (error) {
        console.warn('Error unselecting calendar:', error);
      }
    }

    setDate(arg.start);

    createDialog.handleOpen({
      range: {
        start: arg.start.getTime(),
        end: arg.end.getTime()
      }
    });
  }, [createDialog]);

  const handleEventSelect = useCallback((arg) => {
    updateDialog.handleOpen({
      eventId: arg.event.id
    });
  }, [updateDialog]);

  const handleEventResize = useCallback(async (arg) => {
    const { event } = arg;

    try {
      if (!event.id) {
        console.error('Event ID is missing');
        toast.error('Cannot update event: ID is missing');
        return;
      }

      // Convert the local time back to UTC for the API
      const utcTime = format(new Date(event.start), "yyyy-MM-dd HH:mm:ss");
      
      await settingsApi.updateReminder(event.id, {
        description: event.extendedProps.description,
        time: utcTime,
        ticket_id: event.extendedProps.internal_ticket_id,
        client_id: event.extendedProps.client_id
      });

      handleEventsGet();
      toast.success('Event updated successfully');
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error(err?.response?.data?.message || 'Failed to update event');
      handleEventsGet();
    }
  }, [handleEventsGet]);

  const handleEventDrop = useCallback(async (arg) => {
    const { event } = arg;

    try {
      if (!event.id) {
        console.error('Event ID is missing');
        toast.error('Cannot update event: ID is missing');
        return;
      }

      // Convert the local time back to UTC for the API
      const utcTime = format(new Date(event.start), "yyyy-MM-dd HH:mm:ss");
      
      const params = {
        description: event.extendedProps.description,
        client_id: event.extendedProps.client_id,
        ticket_id: event.extendedProps.internal_ticket_id,
        time: utcTime
      };
      
      await settingsApi.updateReminder(event.id, params);
      
      setTimeout(() => {
        handleEventsGet();
        toast.success('Event updated successfully');
      }, 1000);
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error(err?.response?.data?.message || 'Failed to update event');
      handleEventsGet();
    }
  }, [handleEventsGet]);

  const handleUpdateOne = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await settingsApi.updateReminder(updatingEvent?.id, {
          ...data,
          ticket_id: updatingEvent?.internal_ticket_id,
          client_id: updatingEvent?.client_id,
        });
        toast.success("Reminder successfully updated!");
        updateDialog.handleClose();
        setIsLoading(false);
        setTimeout(() => {
          handleEventsGet();
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        updateDialog.handleClose();
        if( error?.response?.data?.message?.includes(`Couldn't find Reminder with 'id`) ) {
          toast.error("You cannot update this reminder because it was created by another user.");
        } else {
          toast.error(error?.response?.data?.message);
        }
      }
    },
    [updatingEvent]
  );

  const handleRemoveOne = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await settingsApi.deleteReminder(updatingEvent?.id);
      toast.success("Reminder successfully removed!");
      updateDialog.handleClose();
      setTimeout(() => {
        handleEventsGet();
      }, 1000);
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error("Only creator can delete this reminder");
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [handleEventsGet, updatingEvent]);

  return (
    <>
      <Seo title="Dashboard: Calendar" />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <CalendarToolbar
              date={date}
              onAddClick={handleAddClick}
              onDateNext={handleDateNext}
              onDatePrev={handleDatePrev}
              onDateToday={handleDateToday}
              onViewChange={handleViewChange}
              onAddEvent={() => {
                createDialog.handleOpen();
                setDate(new Date());
              }}
              view={view}
            />
            <ReminderAISummary />
            <Card>
              <CalendarContainer>
                <LazyFullCalendar
                  allDayMaintainDuration
                  dayMaxEventRows={3}
                  droppable
                  editable
                  eventClick={handleEventSelect}
                  eventDisplay="block"
                  eventDrop={handleEventDrop}
                  eventResizableFromStart
                  eventResize={handleEventResize}
                  events={events}
                  headerToolbar={false}
                  height={800}
                  initialDate={date}
                  initialView={view}
                  ref={calendarRef}
                  rerenderDelay={10}
                  select={handleRangeSelect}
                  selectable
                  weekends
                />
              </CalendarContainer>
            </Card>
          </Stack>
        </Container>
      </Box>
      {createDialog.open && (
        <CalendarEventDialog
          action="create"
          date={date}
          onAddComplete={createDialog.handleClose}
          onClose={createDialog.handleClose}
          open={createDialog.open}
          range={createDialog.data?.range}
          handleEventsGet={handleEventsGet}
        />
      )}
      {updatingEvent && (
        <EditReminderModal
          open={updateDialog.open}
          onClose={updateDialog.handleClose}
          reminder={updatingEvent}
          onUpdateReminder={handleUpdateOne}
          onDeleteReminder={handleRemoveOne}
          isLoading={isLoading}
          deleteLoading={deleteLoading}
        />
      )}
    </>
  );
};

export default Page;

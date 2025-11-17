import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyFullCalendar } from 'src/components/lazy-fullcalendar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Seo } from 'src/components/seo';
import { CalendarToolbar } from 'src/sections/landing/calendar/calendar-toolbar';
import { CalendarContainer } from 'src/sections/landing/calendar/calendar-container';

const Page = () => {
  const calendarRef = useRef(null);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(mdUp ? 'timeGridDay' : 'dayGridMonth');

  const handleScreenResize = useCallback(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mdUp ? 'dayGridMonth' : 'timeGridDay';

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarRef, mdUp]);

  useEffect(() => {
    handleScreenResize();
  },
  [mdUp]);

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

  return (
    <>
      <Seo title="Calendar" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <CalendarToolbar
              date={date}
              onDateNext={handleDateNext}
              onDatePrev={handleDatePrev}
              onDateToday={handleDateToday}
              onViewChange={handleViewChange}
              view={view}
            />
            <Card>
              <CalendarContainer>
                <LazyFullCalendar
                  allDayMaintainDuration
                  dayMaxEventRows={3}
                  droppable
                  editable
                  eventDisplay="block"
                  eventResizableFromStart
                  headerToolbar={false}
                  height={800}
                  initialDate={date}
                  initialView={view}
                  ref={calendarRef}
                  rerenderDelay={10}
                  selectable
                  weekends
                />
              </CalendarContainer>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;

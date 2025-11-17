import { lazy, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import Box from "@mui/material/Box";

// Import plugins directly since they're small and needed immediately
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// Lazy load the main calendar component
const LazyCalendar = lazy(() => import('@fullcalendar/react'));


const LazyFullCalendarComponent = forwardRef((props, ref) => {
  const calendarRef = useRef(null);
  const isMountedRef = useRef(true);

  useImperativeHandle(ref, () => ({
    getApi: () => {
      if (calendarRef.current && calendarRef.current.getApi) {
        return calendarRef.current.getApi();
      }
      return null;
    },
    destroy: () => {
      if (calendarRef.current && calendarRef.current.destroy && isMountedRef.current) {
        try {
          calendarRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying calendar:', error);
        }
      }
    }
  }));

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Prepare plugins array - use the imported plugins directly
  const plugins = [
    dayGridPlugin,
    interactionPlugin,
    listPlugin,
    timeGridPlugin,
    timelinePlugin
  ];

  return (
    <Box>
      <LazyCalendar 
        {...props} 
        plugins={plugins}
        ref={(node) => {
          calendarRef.current = node;
          if (typeof props.ref === 'function') {
            props.ref(node);
          } else if (props.ref) {
            props.ref.current = node;
          }
        }}
      />
    </Box>
  );
});

LazyFullCalendarComponent.displayName = 'LazyFullCalendar';

export const LazyFullCalendar = LazyFullCalendarComponent;

export const LazyFullCalendarPlugins = {
  dayGrid: dayGridPlugin,
  interaction: interactionPlugin,
  list: listPlugin,
  timeGrid: timeGridPlugin,
  timeline: timelinePlugin
};

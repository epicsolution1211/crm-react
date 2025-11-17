import { calendarApi } from 'src/api/calendar';
import { settingsApi } from 'src/api/settings';
import { slice } from 'src/slices/calendar';

const getEvents = (params = {}) => async (dispatch) => {
  // const response = await calendarApi.getEvents();
  const res = await settingsApi.getReminders(params);

  const updatedRes = res?.reminders?.map(r => ({
    ...r,
    start: new Date(r?.time?.split(".")[0]).getTime(),
    end: new Date(r?.time?.split(".")[0]).getTime(),
    allDay: false,
    title: r?.description ?? "No description",
  }));

  dispatch(slice.actions.getEvents(updatedRes));
};

const createEvent = (params) => async (dispatch) => {
  const response = await calendarApi.createEvent(params);

  dispatch(slice.actions.createEvent(response));
};

const updateEvent = (params) => async (dispatch) => {
  const response = await calendarApi.updateEvent(params);

  dispatch(slice.actions.updateEvent(response));
};

const deleteEvent = (params) => async (dispatch) => {
  await calendarApi.deleteEvent(params);

  dispatch(slice.actions.deleteEvent(params.eventId));
};

export const thunks = {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent
};

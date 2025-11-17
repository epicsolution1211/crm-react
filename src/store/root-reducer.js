import { combineReducers } from "@reduxjs/toolkit";
import { reducer as agentReducer } from "src/slices/agent";
import { reducer as calendarReducer } from "src/slices/calendar";
import { reducer as chatReducer } from "src/slices/chat";
import { reducer as clientChatReducer } from "src/slices/client_chat";
import { reducer as companiesReducer } from "src/slices/company";
import { reducer as contactListReducer } from "src/slices/contact_list";
import { reducer as customersReducer } from "src/slices/customers";
import { reducer as internalChatReducer } from "src/slices/internal_chat";
import { reducer as settingsReducer } from "src/slices/settings";
import { reducer as providersReducer } from "src/slices/provider";
import { reducer as currencyReducer } from "src/slices/currency";
import { reducer as dealingReducer } from "src/slices/dealing";
import { reducer as recordsReducer } from "src/slices/records";
import { reducer as leadReducer } from "src/slices/lead";
import { reducer as submittedFormsReducer } from "src/slices/submitted_forms";
import { reducer as ticketsReducer } from "src/slices/tickets";

export const rootReducer = combineReducers({
  agent: agentReducer,
  calendar: calendarReducer,
  chat: chatReducer,
  client_chat: clientChatReducer,
  companies: companiesReducer,
  contact_list: contactListReducer,
  customers: customersReducer,
  dealing: dealingReducer,
  internal_chat: internalChatReducer,
  settings: settingsReducer,
  providers: providersReducer,
  currency: currencyReducer,
  records: recordsReducer,
  leads: leadReducer,
  submittedForms: submittedFormsReducer,
  tickets: ticketsReducer,
});

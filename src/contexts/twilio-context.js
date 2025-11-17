/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect, useCallback } from "react";
import { Device } from "twilio-client";
import { toast } from "react-hot-toast";

import { chatApi } from "src/api/chat";
import { CallPopup } from "src/components/call-popup";
import { useSearchParams } from "src/hooks/use-search-params";
import { IncomingCallPopup } from "src/components/incoming-call-popup";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";

// Create a new context
const TwilioVoiceContext = createContext();

const TwilioVoiceProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const [internalDevice, setInternalDevice] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [participants, setParticipants] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [chatToken, setChatToken] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isTwilioAllowed, setIsTwilioAllowed] = useState(true);
  const [autodialRunning, setAutodialRunning] = useState(false);

  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const _conversationId = searchParams.get("conversationId");
    const _ticketId = searchParams.get("ticketId");
    const _token = searchParams.get("token");

    if (_conversationId) setConversationId(_conversationId);
    if (_ticketId) setTicketId(_ticketId);
    if (_token) setChatToken(_token);
  }, [searchParams]);

  const initializeVoiceSDK = async () => {
    try {
      // Get token from the API
      const token = await chatApi.getTwilioToken();
      const internalToken = await chatApi.getTwilioToken(
        {},
        "conversation_internal_token"
      );

      if (!token || !internalToken) {
        setIsTwilioAllowed(false);
        return;
      }

      // Create a new Device
      const voiceDevice = new Device(token);
      const internalVoiceDevice = new Device(token);
      setDevice(voiceDevice);
      setInternalDevice(internalVoiceDevice);

      setIsReady(true);

      return {
        isAllowed: !!token,
      };
    } catch (error) {
      console.error("Error initializing Twilio Voice SDK:", error);
    }
  };

  useEffect(() => {
    // Initialize the Twilio Voice SDK
    if (user) initializeVoiceSDK();

    // Cleanup function
    return () => {
      if (device) {
        device.disconnectAll();
        device.destroy();
      }
      if (internalDevice) {
        internalDevice.disconnectAll();
        internalDevice.destroy();
      }
    };
  }, [user]);

  const handleParticipantsUpdate = useCallback(
    (participant) => {
      let actualParticipant = {};
      const exists = participants.some(
        (p) => p.account_id === participant.conversation_account.account_id
      );

      if (participant.account)
        actualParticipant = {
          ...participant.account,
          ...participant.conversation_account,
        };
      if (participant.client)
        actualParticipant = {
          ...participant.client,
          ...participant.conversation_account,
        };
      if (participant.visitor)
        actualParticipant = {
          ...participant.visitor,
          ...participant.conversation_account,
        };

      if (!actualParticipant.in_call && !exists) return;

      if (actualParticipant.in_call && !exists) {
        setParticipants(participants.concat(actualParticipant));
      }

      if (actualParticipant.in_call && exists) {
        setParticipants(
          participants.map((p) => {
            if (p.account_id === actualParticipant.account_id) {
              return actualParticipant;
            } else {
              return p;
            }
          })
        );
      }

      if (!actualParticipant.in_call && exists) {
        setParticipants(
          participants.filter(
            (p) => p.account_id !== actualParticipant.account_id
          )
        );
      }
    },
    [participants]
  );

  const handleTwilioExtrasInit = useCallback(
    (data = {}) => {
      const { conversation, token, ticket, customer } = data;

      setConversationId(conversation);
      setChatToken(token);
      setTicketId(ticket);
      setCustomerId(customer);

    },
    []
  );

  useEffect(() => {
    if (device) {
      // Event listener for connection established
      const onConnect = (connection) => {
        setCallStatus("connected");
        setActiveConnection(connection);
        // Do something when the call is connected
      };

      // Event listener for connection disconnected
      const onDisconnect = () => {
        const autodial = localStorage.getItem("autodial")
          ? JSON.parse(localStorage.getItem("autodial"))
          : false;
        setCallStatus("disconnected");
        device.disconnectAll();
        internalDevice.disconnectAll();
        if (autodial) {
          setAutodialRunning(true);
          handleAutodial();
        }
        // Do something when the call is disconnected
      };

      // Event listener for incoming call
      const onIncoming = (connection) => {
        setCallStatus("incoming");
        setActiveConnection(connection);
      };

      device.on("connect", onConnect);
      device.on("disconnect", onDisconnect);
      device.on("incoming", onIncoming);

      // Cleanup function
      return () => {
        device.off("connect", onConnect);
        device.off("disconnect", onDisconnect);
        device.off("incoming", onIncoming);
      };
    }
  }, [
    device,
    internalDevice,
    conversationId,
  ]);

  const handleAutodial = useCallback(async () => {
    const labelId = localStorage.getItem("autodial_label");
    const provider = localStorage.getItem("autodial_call_provider");
    const limit = localStorage.getItem("autodial_max_try");
    const companyNumber = localStorage.getItem("autodial_company_number");

    if (!labelId) return;

    const request = {};
    if (limit) request.limit = limit;
    request.client_label_id = labelId;

    if (provider === "Twilio") {
      const response = await customersApi.startAutodial(request);

      if (!response.ticket) {
        await customersApi.stopAutodial();
        setAutodialRunning(false);
        localStorage.removeItem('autodial');
        localStorage.removeItem('autodial_label');
        localStorage.removeItem('autodial_max_try');
        localStorage.removeItem('autodial_company_number');
        toast("There are no tickets for this label. Please try another!");
        return;
      }

      const customerPhoneNumber = response?.client_phone_numbers?.[0];

      if (!customerPhoneNumber) {
        toast("Customer does not have a phone number!");
        handleAutodial();
        return;
      }

      const twilioData = {
        conversation: response?.ticket?.conversation_id,
        token: response?.ticket?.conversation?.token,
        ticket: response?.ticket?.id,
        customer: response?.ticket?.client?.id,
        phone: customerPhoneNumber?.id,
        companyPhone: companyNumber,
      };

      handleMakeTwilioCall(twilioData);
    }
  }, []);

  const handleMakeTwilioCall = useCallback(
    async (data = {}) => {
      const { conversation, phone, companyPhone } =
        data;
      handleTwilioExtrasInit(data);

      makeInternalCall({
        target_id: `conversation_internal_${conversation}_${user.id}`,
      });

      setTimeout(() => {
        makeCall({
          target_id: `phone_${conversation}_${phone}_${companyPhone}_${user.id}`,
        });
      }, 3000);
    },
    [handleTwilioExtrasInit, user]
  );

  // Function to handle making an external call
  const makeCall = useCallback(
    (params = {}) => {
      if (device) {
        const outgoingCall = device.connect(params);
        // Handle any further actions with the outgoing call (e.g., event listeners, etc.)
        // For simplicity, we won't cover those in this example
      }
    },
    [device]
  );

  // Function to handle making an internal call
  const makeInternalCall = useCallback(
    (params = {}) => {
      if (internalDevice) {
        const outgoingCall = internalDevice.connect(params);
        // Handle any further actions with the outgoing call (e.g., event listeners, etc.)
        // For simplicity, we won't cover those in this example
      }
    },
    [internalDevice]
  );

  // Function to handle joining the call
  const joinCall = (params = {}) => {
    if (internalDevice) {
      internalDevice.connect(params.internalTarget);
    }

    if (device) {
      device.connect(params.externalTarget);
    }
  };

  const muteExternal = useCallback(
    (mute) => {
      const connection = device.activeConnection();
      connection.mute(mute);
    },
    [device]
  );

  const muteInternal = useCallback(
    (mute) => {
      const connection = internalDevice.activeConnection();
      connection.mute();
    },
    [internalDevice]
  );

  const answerCall = useCallback(() => {
    if (activeConnection) activeConnection?.accept();
  }, [activeConnection]);

  const declineCall = useCallback(() => {
    if (activeConnection) activeConnection?.reject();
  }, [activeConnection]);

  // Provide the Twilio Voice context values to the child components
  return (
    <TwilioVoiceContext.Provider
      value={{
        isReady,
        makeCall,
        makeInternalCall,
        muteExternal,
        muteInternal,
        answerCall,
        declineCall,
        joinCall,
        setConversationId,
        setTicketId,
        setChatToken,
        chatToken,
        conversationId,
        ticketId,
        setCustomerId,
        allowed: isTwilioAllowed,
        handleTwilioExtrasInit,
        autodialRunning,
      }}
    >
      {callStatus === "connected" && (
        <CallPopup
          customerId={customerId}
          ticketId={ticketId}
          chatToken={chatToken}
          conversationId={conversationId}
          participants={participants}
        />
      )}
      {callStatus === "incoming" && (
        <IncomingCallPopup conversationId={conversationId} />
      )}
      {children}
    </TwilioVoiceContext.Provider>
  );
};

export { TwilioVoiceContext, TwilioVoiceProvider };

/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect, useCallback } from "react";

import ringTone from "src/assets/ringing-tone.wav";

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const audio = new Audio(ringTone);
    audio.loop = true;
    setPlayer(audio);
  }, []);

  const handlePlayRingTone = () => {
    if (player) player.play();
  };

  const handleStopRingTone = useCallback(() => {
    if (player) player.stop();
  }, [player]);

  return (
    <NotificationsContext.Provider value={{
      player
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export { NotificationsContext, NotificationsProvider };

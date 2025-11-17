import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";

function convertSecondsToTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

const CountUp = () => {
  const [count, setCount] = useState(0);
  let timerId;

  useEffect(() => {
    startCountUp();

    return () => {
      stopCountUp();
    };
  }, []);

  const startCountUp = () => {
    stopCountUp(); // Stop any existing count-up

    timerId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000); // Increment count every 1 second (adjust as needed)
  };

  const stopCountUp = () => {
    clearInterval(timerId);
    setCount(0);
  };

  return (
    <Stack direction="column" alignItems="center">
      <Typography>Calling</Typography>
      <Typography>{convertSecondsToTime(count)}</Typography>
    </Stack>
  );
};

export default CountUp;

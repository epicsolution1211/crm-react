import React from 'react';
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";

export const Autodial = ({ row }) => {
  const autodialStarted = useSelector((state) => state.customers.autodialStarted);
  const autodialClientId = useSelector((state) => state.customers.autodialClientId);

  if (
    autodialStarted &&
    autodialClientId &&
    autodialClientId == row?.id
  ) {
    return (
      <Typography sx={{ whiteSpace: "nowrap" }}>Calling...</Typography>
    );
  } else {
    return <></>;
  }
}

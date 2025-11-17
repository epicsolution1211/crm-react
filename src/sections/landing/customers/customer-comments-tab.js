import { useMemo } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { format } from "date-fns";

import { Iconify } from 'src/components/iconify';

export const LandingCustomerCommentsTab = ({ customer }) => {
  const commentMockedList = useMemo(() => {
    if (customer) {
      return [
        {
          id: 1,
          account_name: "David Brown",
          created_at: new Date(),
          comment: "Followed up with the client regarding their support ticket. Resolved the issue by providing step-by-step instructions. Closing the ticket.",
        },
        {
          id: 2,
          account_name: "William Taylor",
          created_at: new Date(),
          comment: "Addressed customer complaint regarding shipping delays. Provided a discount on the next purchase as a goodwill gesture. Customer satisfied.",
        },
        {
          id: 3,
          account_name: "Olivia Martin",
          created_at: new Date(),
          comment: "Addressed customer complaint regarding shipping delays. Provided a discount on the next purchase as a goodwill gesture. Customer satisfied.",
        },
        {
          id: 4,
          account_name: "Henry Turner",
          created_at: new Date(),
          comment: "Collaborating with the marketing team on a new campaign. Shared insights on target audience preferences and recommended messaging.",
        },
      ]
    }
  }, [customer]);

  const steps = useMemo(() => (commentMockedList?.map((comment) => {
    return (
      {
        labelRender: () => {
          return (
            <Stack direction='row' justifyContent='space-between'>
              <Typography sx={{ px: 1 }}>{comment.account_name}</Typography>
              <Typography sx={{ px: 1 }}>{format(new Date(comment?.created_at), "dd MMM yyyy HH:mm")}</Typography>
            </Stack>)
        },
        contentRender: () => (
          <Stack
            direction={"row"}
            alignItems={"start"}
            spacing={2}
            py={1}
            justifyContent={"space-between"}
            key={comment?.id}
          >
            <Box dangerouslySetInnerHTML={{ __html: comment?.comment?.replace(/\n/g, "<br>") }} />
            <Stack direction='row' gap={1}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                >
                  <Iconify icon="mage:edit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                >
                  <Iconify icon="heroicons:trash" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        )
      }
    );
  })), [commentMockedList])

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant={"h6"}>Comments</Typography>
            <Button variant={"contained"} >
              + Add
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Stepper
          orientation="vertical">
          {steps?.filter(s => s)?.map((step, index) => (
            <Step
              active
              key={index}>
              <StepLabel>
                {step?.labelRender()}
              </StepLabel>
              <StepContent>
                {step?.contentRender()}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );
};

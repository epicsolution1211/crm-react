import { useMemo } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";

import { Iconify } from 'src/components/iconify';

export const LandingCustomerPosts = ({ customer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const commentMockedList = useMemo(() => {
    if (customer) {
      return [
        {
          id: 1,
          account_name: "David Brown",
          created_at: new Date(),
          comment: "Customer Relationship Management (CRM) systems offer numerous benefits for businesses. From streamlining communication to improving customer satisfaction, implementing a CRM solution can transform the way you manage customer interactions. In this post, we explore the key advantages of adopting CRM and how it can positively impact your business operations.",
        },
        {
          id: 2,
          account_name: "William Taylor",
          created_at: new Date(),
          comment: "Selecting the right CRM software is crucial for the success of your business. With various options available, finding a solution that aligns with your unique needs is essential. This post provides a comprehensive guide to help you navigate the process of choosing the right CRM software. Learn about key features, considerations, and best practices in CRM software selection.",
        },
        {
          id: 3,
          account_name: "Olivia Martin",
          created_at: new Date(),
          comment: "CRM isn't just a tool for managing customer relationships; it's also a powerful asset for boosting sales. This post delves into effective strategies for maximizing sales through CRM. From lead management to customer segmentation, discover how CRM can enhance your sales processes and contribute to the overall growth of your business.",
        },
        {
          id: 4,
          account_name: "Henry Turner",
          created_at: new Date(),
          comment: "As technology continues to evolve, so does the landscape of Customer Relationship Management. In this post, we explore emerging trends in CRM that are shaping the future of customer engagement. From artificial intelligence to personalized customer experiences, stay informed about the latest developments and position your business for success in the evolving CRM landscape.",
        },
      ]
    }
  }, [customer]);

  const steps = useMemo(
    () =>
      commentMockedList?.map((comment) => {
        return {
          labelRender: () => {
            return (
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent={isMobile ? "flex-start" : "space-between"}
                alignItems={isMobile ? "flex-start" : "center"}
                spacing={isMobile ? 0.5 : 0}
                sx={{ width: 1 }}
              >
                <Typography sx={{ px: 1, fontSize: isMobile ? 14 : 16, wordBreak: 'break-word' }}>
                  {comment.account_name}
                </Typography>
                <Typography sx={{ px: 1, fontSize: isMobile ? 12 : 14, color: 'text.secondary', mt: isMobile ? 0.5 : 0 }}>
                  {format(new Date(comment?.created_at), "dd MMM yyyy HH:mm")}
                </Typography>
              </Stack>
            );
          },
          contentRender: () => (
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "stretch" : "start"}
              spacing={isMobile ? 1 : 2}
              py={1}
              justifyContent={isMobile ? "flex-start" : "space-between"}
              key={comment?.id}
              sx={{ width: 1 }}
            >
              <Box
                sx={{
                  flex: 1,
                  fontSize: isMobile ? 13 : 15,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  pr: isMobile ? 0 : 2,
                }}
                dangerouslySetInnerHTML={{
                  __html: comment?.comment?.replace(/\n/g, "<br>")
                }}
              />
              <Stack
                direction={isMobile ? "row" : "row"}
                gap={isMobile ? 2 : 1}
                sx={{ minWidth: isMobile ? 0 : 150, mt: isMobile ? 1 : 0, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}
                justifyContent={isMobile ? "flex-start" : "flex-end"}
              >
                <IconButton size="small" aria-label="Edit post" tabIndex={0}>
                  <Iconify icon="mage:edit" />
                </IconButton>
                <IconButton size="small" aria-label="Delete post" tabIndex={0}>
                  <Iconify icon="heroicons:trash" />
                </IconButton>
              </Stack>
            </Stack>
          ),
        };
      }),
    [commentMockedList, isMobile]
  );

  return (
    <Card sx={{ width: 1, maxWidth: 600, mx: 'auto', boxShadow: 2 }}>
      <CardHeader
        title={
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? 1 : 0 }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontSize: isMobile ? 16 : 20 }}>
              Posts
            </Typography>
            <Button variant={"contained"} size={isMobile ? "small" : "medium"} sx={{ minWidth: isMobile ? 80 : 120, fontSize: isMobile ? 13 : 16 }} onClick={() => setModalOpen && setModalOpen(true)}>
              + Add
            </Button>
          </Stack>
        }
      />
      <CardContent sx={{ px: isMobile ? 1 : 3, py: isMobile ? 1 : 2 }}>
        <Stepper orientation="vertical">
          {steps
            ?.filter((s) => s)
            ?.map((step, index) => (
              <Step active key={index} sx={{ width: 1 }}>
                <StepLabel>{step?.labelRender()}</StepLabel>
                <StepContent>{step?.contentRender()}</StepContent>
              </Step>
            ))}
        </Stepper>
      </CardContent>
    </Card>
  );
};

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { paths } from "src/paths";
import { Iconify } from "src/components/iconify";

import { OffersTable } from "src/sections/dashboard/lead-management/offers/offers-table";
import { Seo } from "src/components/seo";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  usePageView();
  const isMounted = useMounted();
  const { company, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_lm_offer === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  useEffect(() => {
    if (isMounted()) {
      setIsLoading(false);
    }
  }, [isMounted]);

  const handleCopyLink = () => {
    const host = window?.location?.origin;

    copyToClipboard(`${host}/offers?company=${company?.token}`);
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress
          size={70}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        />
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Dashboard : Offers`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Offers</Typography>
              <Button
                onClick={handleCopyLink}
                variant="outlined"
                endIcon={<Iconify icon="mdi:content-copy" width={16} />}
              >
                Copy link
              </Button>
            </Stack>
            <Box />
          </Stack>
          <OffersTable />

        </Container>
      </Box>
    </>
  );
};

export default Page;

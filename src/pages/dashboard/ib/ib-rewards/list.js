import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { ibsApi } from "src/api/ibs";
import { brandsApi } from "src/api/lead-management/brand";
import { usePageView } from "src/hooks/use-page-view";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { IbRewardsListTable } from "src/sections/dashboard/ib/ib-rewards/ib-rewards-list-table";
import { IBRewardsEditModal } from "src/sections/dashboard/ib/ib-rewards/ib-rewards-edit-modal";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { Iconify } from "src/components/iconify";

const useGetBrands = () => {
  const [brands, setBrands] = useState([]);
  const [currentBrandId, setCurrentBrandId] = useState();

  const handleGetBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      setBrands(res?.internal_brands ?? []);
      setCurrentBrandId(res?.internal_brands?.[0]?.id);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetBrands();
  }, []);

  return { brands, currentBrandId, setCurrentBrandId };
}

const Page = () => {
  usePageView();
  const router = useRouter();
  const { user } = useAuth();

  const { brands, currentBrandId, setCurrentBrandId } = useGetBrands();

  const [isLoading, setIsLoading] = useState(true);

  const [ibRewards, setIbRewards] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);

  const handleGetIbRewards = async () => {
    setIsLoading(true);
    try {
      const res = await ibsApi.getIbRewards({ internal_brand_id: currentBrandId });
      setIbRewards(res?.rewards);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.acc?.acc_v_ib_rewards === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  useEffect(() => {
    if (currentBrandId) {
      handleGetIbRewards();
    }
  }, [currentBrandId]);

  return (
    <>
      <Seo title={`Dashboard: IB Rewards`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">IB Rewards</Typography>
              <Button
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
                onClick={() => setOpenEditModal(true)}
              >
                Add
              </Button>
            </Stack>
            <PayWallLayout>
              <Card>
                <IbRewardsListTable
                  isLoading={isLoading}
                  tableData={ibRewards}
                  brands={brands}
                  currentBrandId={currentBrandId}
                  setCurrentBrandId={setCurrentBrandId}
                  handleGetIbRewards={handleGetIbRewards}
                  currentBrandInfo={brands?.find((brand) => brand?.id === currentBrandId)}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
      <IBRewardsEditModal 
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        brandId={currentBrandId}
        handleGetIbRewards={handleGetIbRewards}
      />
    </>
  );
};

export default Page;

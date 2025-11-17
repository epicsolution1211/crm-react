import Box from "@mui/material/Box";

import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { RoleEdit } from "src/sections/dashboard/settings/role/edit";
import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "src/api/settings";

const Page = () => {
  usePageView();
  const params = useParams();
  const [template, setTemplate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getTemplate = useCallback(async () => {
    try {
      setIsLoading(true);
      const { temp_roll: tempRoll } = await settingsApi.getRole(params?.roleId);
      setTemplate(tempRoll);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }, [params]);

  useEffect(() => {
    getTemplate();
  }, [params]);

  return (
    <>
      <Seo title={`Dashboard: Role Edit`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <RoleEdit template={template} isLoading={isLoading} onGetTemplate={getTemplate} />
      </Box>
    </>
  );
};

export default Page;

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";

import CountryPanel from "./country-panel";
import { brandsApi } from "src/api/lead-management/brand";
import { AddCountryDialog } from "./add-country-dialog";
import { useAuth } from "src/hooks/use-auth";

const Countries = ({ brand }) => {
  const { user } = useAuth();
  const [brandCountries, setBrandCountries] = useState([]);
  const [timeCapacity, setTimeCapacity] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getBrandCountries = async () => {
    setIsLoading(true);
    try {
      const res = await brandsApi.getBrandCountries({ brand_id: brand?.id });
      setBrandCountries(res?.countries);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  const getBrandTimeCapacity = async () => {
    try {
      const res = await brandsApi.getTimeCapacities(brand?.id);
      setTimeCapacity(res?.time_caps);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleBrandCountryCreate = async (data) => {
    try {
      await brandsApi.createBrandCountry({ ...data, brand_id: brand?.id });
      toast.success("Brand country successfully created!");
      getBrandCountries({ brand_id: brand?.id });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleBrandCountryUpdate = async (id, data) => {
    try {
      await brandsApi.updateBrandCountry(id, data);
      toast.success("Brand country successfully updated!");
      getBrandCountries({ brand_id: brand?.id });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleBrandCountryDelete = async (id) => {
    try {
      await brandsApi.deleteBrandCountry(id);
      toast.success("Brand country successfully deleted!");
      getBrandCountries({ brand_id: brand?.id });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBrandCountries();
    getBrandTimeCapacity();
  }, []);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Brand Countries</Typography>

            {user?.acc?.acc_e_lm_brand ? (
              <Button
                variant="contained"
                onClick={() => setCreateModalOpen(true)}
              >
                + Add
              </Button>
            ) : null}
          </Stack>

          <Grid sx={{ mt: 2 }} spacing={3} container>
            <CountryPanel
              isLoading={isLoading}
              brandCountries={brandCountries}
              timeCapacity={timeCapacity}
              onBrandCountryUpdate={handleBrandCountryUpdate}
              onBrandCountryDelete={handleBrandCountryDelete}
              getBrandCountries={getBrandCountries}
              brandId={brand?.id}
            />
            <Grid xs={12} lg={9}></Grid>
          </Grid>
        </CardContent>
      </Card>

      <AddCountryDialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        timeCapacity={timeCapacity}
        onBrandCountryCreate={handleBrandCountryCreate}
      />
    </Stack>
  );
};

export default Countries;

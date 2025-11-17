import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import toast from "react-hot-toast"

import CountryPanel from './country-panel';
import TimeCapacityPanel from './capacity-panel';
import { brandsApi } from '../../../../../api/lead-management/brand';

const TimeCapacity = ({ brandId }) => {
  const [timeCapacity, setTimeCapacity] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();

  const getTimeCapacity = async (id) => {
    try {
      const res = await brandsApi.getTimeCapacities(brandId);
      setTimeCapacity(res?.time_caps);
      setSelectedCountry(id ? res?.time_caps?.find((item) => (item?.id === id)) : res?.time_caps[0]);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const createTimeCapacity = async (data) => {
    try {
      const res = await brandsApi.createTimeCapacities(data);
      getTimeCapacity(res?.time_cap?.id);
      toast("Time & Capacity successfully created!");
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const updateTimeCapacity = async (id, data) => {
    try {
      const res = await brandsApi.updateTimeCapacities(id, data);
      getTimeCapacity(res?.time_cap?.id);
      toast("Time & Capacity successfully updated!");
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const deleteTimeCapacity = async (id) => {
    try {
      await brandsApi.deleteTimeCapacities(id);
      getTimeCapacity();
      toast("Time & Capacity successfully deleted!");
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getTimeCapacity();
  }, []);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Typography variant="h5">
            Time & Capacity
          </Typography>
          <Grid
            sx={{ mt: 2 }}
            spacing={3}
            container>
            <CountryPanel
              setSelectedCountry={setSelectedCountry}
              selectedCountry={selectedCountry}
              timeCapacity={timeCapacity}
              createTimeCapacity={createTimeCapacity}
              updateTimeCapacity={updateTimeCapacity}
              deleteTimeCapacity={deleteTimeCapacity}
              getTimeCapacity={getTimeCapacity}
              brandId={brandId}
            />
            <Grid
              xs={12}
              lg={9}>
              <TimeCapacityPanel
                activeCountry={selectedCountry}
                timeCapacity={timeCapacity}
                updateTimeCapacity={updateTimeCapacity}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default TimeCapacity
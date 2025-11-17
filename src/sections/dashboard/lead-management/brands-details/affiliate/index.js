import React, { useState, useMemo, useEffect } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Iconify } from 'src/components/iconify';
import CustomModal from "src/components/customize/custom-modal";
import SliderBar from "src/components/customize/slider-bar";
import { DeleteModal } from "src/components/customize/delete-modal";
import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import { TableSkeleton } from "src/components/table-skeleton";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { brandsApi } from "src/api/lead-management/brand";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";

const validationSchema = yup.object({
  account_id: yup.string().required("Affiliate is a required field"),
});

const Affiliate = ({ brandId }) => {
  const { user } = useAuth();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [affiliate, setAffiliate] = useState([]);
  const [nonAccountIds, setNonAccountIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState({});

  const updateTraffic = useDebounce(sliderValue, 200);

  const [affiliateList, setAffiliateList] = useState([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState(false);
  const [timeCapacity, setTimeCapacity] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const totalValue = useMemo(() => {
    if (affiliate) {
      const totalVal = affiliate?.reduce((total, item) => {
        total = total + item?.percentage;
        return total;
      }, 0);
      return totalVal;
    }
  }, [affiliate]);

  const getBrandAffiliate = async () => {
    setIsLoading(true);
    try {
      const res = await brandsApi.getAffiliate(brandId);
      const affiliateList = res?.brand_affiliates?.map((item, index) => ({
        ...item,
        max:
          100 -
          res?.brand_affiliates
            ?.filter((item, itemIndex) => index !== itemIndex)
            ?.reduce((total, current) => total + current?.percentage, 0),
      }));
      setAffiliate(affiliateList);
      const nonAccountIds = res?.brand_affiliates?.map(
        (item) => item?.account_id
      );
      setNonAccountIds(nonAccountIds);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleUpdateAffiliate = (index, value) => {
    const newList = [...affiliate];
    newList[index].percentage = value;
    setAffiliate(newList);
  };

  const onSubmit = async (data) => {
    try {
      await brandsApi.createAffiliate({ ...data, brand_id: brandId });
      getBrandAffiliate();
      setModalOpen(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateAffiliate = async (id, data, isPercentage) => {
    try {
      await brandsApi.updateAffiliate(id, data);
      if (!isPercentage) {
        getBrandAffiliate();
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const deleteBrandAffiliate = async () => {
    try {
      await brandsApi.deleteAffiliate(selectedAffiliate);
      getBrandAffiliate();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("error: ", error);
    }
    setSelectedAffiliate("");
  };

  const getAffiliates = async () => {
    try {
      const res = await affiliateApi.getAffiliates({
        non_account_ids: nonAccountIds,
      });
      const affiliateInfo = res?.affiliates?.map((item) => ({
        label: item?.full_name,
        value: item?.id,
      }));
      setAffiliateList(affiliateInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTimeCapacities = async () => {
    try {
      const res = await brandsApi.getTimeCapacities(brandId);
      setTimeCapacity(res?.time_caps);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (updateTraffic?.id) {
      updateAffiliate(updateTraffic?.id, {
        percentage: updateTraffic?.percentage,
      });
    }
  }, [updateTraffic]);

  useEffect(() => {
    getBrandAffiliate();
    getTimeCapacities();
  }, []);

  useEffect(() => {
    if (nonAccountIds) {
      getAffiliates();
    }
  }, [nonAccountIds]);

  return (
    <>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Affiliate</Typography>
              </Stack>
              {user?.acc?.acc_e_lm_brand ? (
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button
                    onClick={() => setModalOpen(true)}
                    startIcon={<Iconify icon="lucide:plus" width={24} />}
                    variant="contained"
                  >
                    Add
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
          <Box mb={4}>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow sx={{ whiteSpace: "nowrap" }}>
                    <TableCell>Affiliate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sx={{ p: 0, pr: 5 }} width={300}>
                      <Stack direction="row" gap={1}>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: "700",
                            width: 60,
                            pr: 2,
                          }}
                        >
                          Traffic
                        </Typography>
                        <SliderBar
                          value={totalValue}
                          disabled={true}
                          setValue={() => {}}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>Time & Capacity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton rowCount={5} cellCount={5} />
                  ) : (
                    affiliate?.map((item, index) => (
                      <TableRow key={item.id} sx={{ whiteSpace: "nowrap" }}>
                        <TableCell>{item?.affiliate_name}</TableCell>
                        <TableCell>
                          <Switch
                            checked={item?.active}
                            onChange={(event) =>
                              updateAffiliate(item?.id, {
                                active: event?.target?.checked,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ p: 0, pr: 5 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            gap={1}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ width: 80, pr: 2 }}
                            >
                              {`${item?.percentage}%`}
                            </Typography>
                            <SliderBar
                              setValue={(val) => {
                                setSliderValue({
                                  id: item?.id,
                                  percentage: val > item?.max ? item?.max : val,
                                });
                                handleUpdateAffiliate(
                                  index,
                                  val > item?.max ? item?.max : val
                                );
                              }}
                              value={item?.percentage}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={item?.time_cap?.id}
                            onChange={(event) =>
                              updateAffiliate(item?.id, {
                                time_cap_id: event?.target?.value,
                              })
                            }
                          >
                            {timeCapacity?.map((capacity) => (
                              <MenuItem key={capacity?.id} value={capacity?.id}>
                                {capacity?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          {user?.acc?.acc_e_lm_brand ? (
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setDeleteModalOpen(true);
                                setSelectedAffiliate(item?.id);
                              }}
                              sx={{ '&:hover': { color: 'error.main' }}}
                            >
                              <Iconify icon="heroicons:trash" />
                            </IconButton>
                          </Tooltip>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Card>
      </Stack>
      <CustomModal
        onClose={() => {
          setModalOpen(false);
        }}
        open={modalOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              {"Create add new Brand Affiliate?"}
            </Typography>
            <Stack>
              <SelectMenu
                control={control}
                label="Affiliate"
                name="account_id"
                list={affiliateList}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                {"Create"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={() => deleteBrandAffiliate()}
        title="Delete Brand Affiliate"
        description="Are you sure you want to delete this Brand Affiliate?"
      />
    </>
  );
};

export default Affiliate;

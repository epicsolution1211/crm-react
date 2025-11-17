import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { EditCountryDialog } from "./edit-country-dialog";
import { Scrollbar } from "src/components/scrollbar";
import { TableSkeleton } from "src/components/table-skeleton";
import { countries } from "src/utils/constant";
import { useAuth } from "src/hooks/use-auth";

const CountryPanel = ({
  brandCountries,
  timeCapacity,
  onBrandCountryUpdate,
  onBrandCountryDelete,
  isLoading,
}) => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [countryToEdit, setCountryToEdit] = useState(null);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const handleEditCountry = useCallback((country) => {
    setCountryToEdit(country);
    setEditModalOpen(true);
  }, []);

  const handleDeleteCountry = useCallback((id) => {
    setCountryToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback((value) => {
    if (!value) setCountryToEdit(null);
    setEditModalOpen(value);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setCountryToDelete(null);
    setDeleteModalOpen(false);
  }, []);

  const handleBrandCountryDelete = useCallback(
    (id) => {
      onBrandCountryDelete(id);
      handleDeleteModalClose();
    },
    [onBrandCountryDelete]
  );

  return (
    <>
      <Grid xs={12} lg={12} sx={{ mt: 2 }}>
        <Stack spacing={1}>
          <List>
            <Stack spacing={1}>
              <Box sx={{ position: "relative", px: 3 }}>
                <Scrollbar>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell x={{ whiteSpace: "nowrap" }}>
                          Country
                        </TableCell>
                        <TableCell x={{ whiteSpace: "nowrap" }}>
                          Time & Capacity
                        </TableCell>
                        <TableCell x={{ whiteSpace: "nowrap" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {isLoading ? (
                        <TableSkeleton rowCount={10} cellCount={3} />
                      ) : (
                        brandCountries?.map((country) => (
                          <TableRow key={country?.id}>
                            <TableCell>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <img
                                  loading="lazy"
                                  width="20"
                                  src={`https://flagcdn.com/w20/${country?.country_code.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${country?.country_code.toLowerCase()}.png 2x`}
                                  alt=""
                                />
                                <Typography variant="subtitle1">
                                  {
                                    countries?.find(
                                      (c) => c.code === country?.country_code
                                    )?.label
                                  }
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{country?.time_cap?.name}</TableCell>
                            <TableCell>
                              {user?.acc?.acc_e_lm_brand ? (
                                <>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      sx={{ '&:hover': { color: 'primary.main' }}}
                                      onClick={() => handleEditCountry(country)}
                                    >
                                      <Iconify icon="mage:edit" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      sx={{ '&:hover': { color: 'error.main' }}}
                                      onClick={() =>
                                        handleDeleteCountry(country?.id)
                                      }
                                    >
                                      <Iconify icon="heroicons:trash" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </Box>
            </Stack>
          </List>
        </Stack>
      </Grid>

      {countryToEdit ? (
        <EditCountryDialog
          open={editModalOpen}
          onClose={handleEditModalClose}
          brandCountry={countryToEdit}
          timeCapacity={timeCapacity}
          onBrandCountryUpdate={onBrandCountryUpdate}
        />
      ) : null}

      {countryToDelete ? (
        <DeleteModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          onDelete={() => handleBrandCountryDelete(countryToDelete)}
          title={"Delete Brand Country"}
          description={"Are you sure you want to delete this brand country?"}
        />
      ) : null}
    </>
  );
};

export default CountryPanel;

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { usePageView } from "src/hooks/use-page-view";
import { useSelector } from "react-redux";

import { FormsTable } from "src/sections/dashboard/submitted-forms/forms-table";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { SubmittedFormsLabelsDialog } from "src/components/submitted-forms-labels-dialog";
import { Seo } from "src/components/seo";
import { submittedFormsApi } from "src/api/submitted-forms";
import { brandsApi } from "src/api/lead-management/brand";
import { thunks } from "src/thunks/submitted_forms";
import { useDebounce } from "src/hooks/use-debounce";
import { useMounted } from "src/hooks/use-mounted";
import { useSelection } from "src/hooks/use-selection";

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

const useSubmittedFormsLabels = (selected, handleSubmittedFormsGet, currentBrandId, selectAll, perPage) => {
  const isMounted = useMounted();
  const [selectedLabels, setSelectedLabels] = useState([]);

  const [loadingStatus, setLoadingStatus] = useState({
    assign: false,
    remove: false,
  });

  const handleSelectedLabelsGet = useCallback(
    async (selectedIds, selectAll) => {
      const requestData = {
        internal_brand_id: currentBrandId,
      };

      if (selectAll) {
        requestData["select_all"] = true;
      }

      if (selectedIds && selectedIds.length > 0) {
        requestData["client_brand_form_ids"] = selectedIds;
      }

      const { labels } = await submittedFormsApi.getSubmittedFormsLabels(requestData);

      if (isMounted()) {
        setSelectedLabels(
          labels
            ?.filter((label) => label.check_status)
            .map((label) => label?.label?.id + "")
        );
      }
    },
    [currentBrandId, isMounted]
  );

  const handleAssignLabels = useCallback(
    async (labels) => {
      setLoadingStatus({ ...loadingStatus, assign: true });
      try {
        const requestData = {};

        if (selectAll) {
          requestData["select_all"] = true;
          if (perPage && perPage > 0) {
            requestData["per_page"] = perPage;
          }
        } else {
          requestData["target_form_ids"] = selected;
        }
  
        if (labels?.length > 0) {
          requestData["assign_label_ids"] = labels.map(label => parseInt(label));
        } 

        await submittedFormsApi.assignSubmittedFormsLabels(requestData);
        setTimeout(() => handleSubmittedFormsGet(), 1500);
        toast.success("Submitted forms labels successfully assigned!");
      } catch (error) {
        toast.error(error?.response?.data?.message ?? "Failed to update submitted forms labels");
      } finally {
        setLoadingStatus({ ...loadingStatus, assign: false });
      }
    },
    [selected, selectAll, perPage, selectedLabels]
  );

  const handleRemoveLabels = useCallback(
    async (labels) => {
      setLoadingStatus({ ...loadingStatus, remove: true });
      try {
        const requestData = {};

        if (selectAll) {
          requestData["select_all"] = true;
          if (perPage && perPage > 0) {
            requestData["per_page"] = perPage;
          }
        } else {
          requestData["client_brand_form_ids"] = selected;
        }
  
        if (labels?.length > 0) {
          requestData["form_label_ids"] = labels.map(label => parseInt(label));
        } 

        await submittedFormsApi.removeSubmittedFormsLabels(requestData);
        setTimeout(() => handleSubmittedFormsGet(), 1500);
        toast.success("Submitted forms labels successfully removed!");
      } catch (error) {
        toast.error(error?.response?.data?.message ?? "Failed to update submitted forms labels");
      } finally {
        setLoadingStatus({ ...loadingStatus, remove: false });
      }
    },
    [selected, selectAll, perPage, selectedLabels]
  );

  useEffect(() => {
    const fetchLabels = async () => {
      if (selectAll) {
        await handleSelectedLabelsGet(
          [],
          selectAll,
          perPage
        );
      } else {
        setSelectedLabels([]);
      }
    };

    fetchLabels();
  }, [
    selectAll,
    handleSelectedLabelsGet,
  ]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!selectAll && selected.length > 0) {
        await handleSelectedLabelsGet(
          selected,
          selectAll,
        );
      }
    };

    fetchLabels();
  }, [selected, handleSelectedLabelsGet]);

  const handleSelectedLabelsChange = useCallback(
    async (labels) => {
      setSelectedLabels(labels);

      const addedLabels = labels.filter((l) => !selectedLabels.includes(l));
      const removedLabels = selectedLabels.filter((l) => !labels.includes(l));

      if (addedLabels?.length) {
        await handleAssignLabels(addedLabels);
      }

      if (removedLabels?.length) {
        await handleRemoveLabels(removedLabels);
      }
    },
    [selectedLabels, handleAssignLabels, handleRemoveLabels]
  );

  return {
    handleAssignLabels,
    handleRemoveLabels,
    handleSelectedLabelsChange,
    selectedLabels,
    setSelectedLabels,
    loadingStatus,
  };
};

const Page = () => {
  usePageView();
  const [labelList, setLabelList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const { brands, currentBrandId, setCurrentBrandId } = useGetBrands();
  const dispatch = useDispatch();

  const submittedFormsState = useSelector((state) => state.submittedForms);

  const query = useDebounce(text, 500);
  const [modalOpen, setModalOpen] = useState(false);

  const submittedFormsIds = useSelector((state) => state.submittedForms.submittedFormsIds);
  const submittedFormsSelection = useSelection(submittedFormsIds ?? [], (message) => {
    toast.error(message);
  });
  const filters = useSelector((state) => state.submittedForms.submittedFormsFilters);
  const updateFilters = (data) => dispatch(thunks.setFilters(data));

  const getSubmittedFormsInformation = async () => {
    let request = {
      page: filters?.currentPage + 1,
      per_page: filters?.perPage,
      q: query,
      internal_brand_id: currentBrandId,
      ...filters,
    };

    try {
      await dispatch(thunks.getSubmittedForms(request));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const { selectedLabels, setSelectedLabels, handleAssignLabels, handleRemoveLabels, handleSelectedLabelsChange, loadingStatus } = useSubmittedFormsLabels(
    submittedFormsSelection?.selected,
    getSubmittedFormsInformation,
    currentBrandId,
    submittedFormsSelection?.selectAll,
    submittedFormsSelection?.perPage
  );

  const getLabels = async () => {
    try {
      const res = await submittedFormsApi.getSubmittedFormsLabels();
      const labelList = res?.labels
        ?.map((label) => ({
          label: label?.name,
          value: label?.id?.toString(),
          color: label?.color,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    const submittedFormsPerPage = localStorage.getItem("submittedFormsPerPage");

    if (submittedFormsPerPage) {
      updateFilters({ perPage: submittedFormsPerPage });
    }
  }, []);

  const getSubmittedForms = async () => {
    setIsLoading(true);
    try {
      await getSubmittedFormsInformation();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getSubmittedForms();
  }, [query, filters, currentBrandId]);

  useEffect(() => {
    getLabels();
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Submitted Forms`} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Submitted Forms</Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <FormsTable
                  isLoading={isLoading}
                  count={submittedFormsState?.submittedFormsInfo?.total_count}
                  onPageChange={(index) =>
                    updateFilters({ currentPage: index })
                  }
                  page={filters?.currentPage}
                  onRowsPerPageChange={(event) => {
                    updateFilters({ perPage: event?.target?.value });
                    localStorage.setItem("submittedFormsPerPage", event?.target?.value);
                  }}
                  rowsPerPage={filters?.perPage}
                  tableData={submittedFormsState?.submittedFormsInfo?.forms ?? []}
                  handleLabelsDialogOpen={() => setModalOpen(true)}
                  labels={filters?.label_ids}
                  setLabels={(val) => updateFilters({ label_ids: val })}
                  labelList={labelList}
                  text={filters?.text}
                  setText={(val) => setText(val)}
                  brands={brands}
                  currentBrandId={currentBrandId}
                  setCurrentBrandId={setCurrentBrandId}
                  selected={submittedFormsSelection?.selected}
                  onSelectAll={submittedFormsSelection.handleSelectAll}
                  onSelectOne={submittedFormsSelection.handleSelectOne}
                  onSelectPage={submittedFormsSelection.handleSelectPage}
                  onDeselectPage={submittedFormsSelection.handleDeSelectPage}
                  onDeselectAll={submittedFormsSelection.handleDeselectAll}
                  onDeselectOne={submittedFormsSelection.handleDeselectOne}
                  selectAll={submittedFormsSelection.selectAll}
                  getSubmittedFormsInformation={getSubmittedFormsInformation}
                  getSubmittedForms={getSubmittedForms}
                  selectedLabels={selectedLabels}
                  setSelectedLabels={setSelectedLabels}
                  handleAssignLabels={handleAssignLabels}
                  handleRemoveLabels={handleRemoveLabels}
                  handleSelectedLabelsChange={handleSelectedLabelsChange}
                  loadingStatus={loadingStatus}
                  perPage={submittedFormsSelection.perPage}
                  setPerPage={submittedFormsSelection.setPerPage}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>

      <SubmittedFormsLabelsDialog
        title="Edit Label"
        internalBrandId={currentBrandId}
        brands={brands}
        open={modalOpen ?? false}
        onClose={() => setModalOpen(false)}
        onGetLabels={getLabels}
      />
    </>
  );
};

export default Page;

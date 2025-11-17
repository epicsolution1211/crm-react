import { useCallback, useMemo, useState, useEffect, memo, useRef, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InfiniteScroll from "react-infinite-scroll-component";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, styled } from '@mui/material/styles';

import { ChatReminderDialog } from "../../chat/chat-reminder-dialog";
import { CustomFilterBoolean } from "src/components/customize/custom-filter-boolean";
import { CustomFilterMultiRadio } from "src/components/customize/custom-filter-multi-radio";
import { CustomFilterNumber } from "src/components/customize/custom-filter-number";
import { CustomFilterText } from "src/components/customize/custom-filter-text";
import { CustomerCreateQuickEmail } from "../../customer/customer-create-quick-email";
import { CustomerCreateSms } from "../../customer/customer-create-sms";
import { CustomerTableHeader } from './table-header';
import { CustomerTablePagination } from "./table-pagination";
import { CustomerTableRow } from "./table-row";
import { CustomerTableToolbar } from './toolbar';
import { FilterChips } from './filter-chips';
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { chatApi } from "src/api/chat";
import { commentsApi } from "src/api/comments";
import { customerFieldsApi } from "src/api/customer-fields";
import { customersApi } from "src/api/customers";
import { hasCustomFilter, hasFilter } from "src/utils/function";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { thunks } from "src/thunks/customers";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerColumns } from "./customer-column";
import { useRouter } from "src/hooks/use-router";
import { useTwilio } from "src/hooks/use-twilio";
import { userApi } from "src/api/user";
import { BulkUpdateFields } from "../../customer/bulk-update-fields";
import { EditCustomFieldModal } from "../../customer/edit-custom-field-modal";
import { CustomerCreateComment } from "../../customer/customer-create-comment";
import { CustomerAssignFormDialog } from "../../customer/customer-assign-form-dialog";
import { useCallProfiles } from "src/hooks/call-system/useCallProfiles";
import Link from "@mui/material/Link";
import { RouterLink } from "src/components/router-link";
import { Iconify } from 'src/components/iconify';

const CustomerBulkActions = lazy(() => import("./bulk-actions"));

export const StyledInfiniteScroll = styled(InfiniteScroll)(({ theme }) => ({
  '&.customer-table::-webkit-scrollbar': {
    width: '7px',
    height: '7px',
  },
  '&.customer-table::-webkit-scrollbar-track': {
    background: alpha(theme.palette.grey[800], 0.1),
  },
  '&.customer-table::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.grey[800], 0.25),
    borderRadius: 4
  },
  '&.customer-table::-webkit-scrollbar-thumb:hover': {
    background: alpha(theme.palette.grey[800], 0.3),
    cursor: 'grabbing'
  },
}));

export const _CustomerListTable = ({
  count = 0,
  handleLabelsDialogOpen,
  handleSelectedLabelsChange,
  handleSelectedLabelsGet = () => { },
  isLoading,
  onDeselectAll,
  onDeselectOne,
  onDeselectPage,
  onGetData,
  onSelectAll,
  onSelectOne,
  onSelectPage,
  onSetCustomFilters,
  customFilters,
  query,
  selectAll,
  selected = [],
  selectedLabels,
  setCustomFilterLoading,
  setText,
  tableData = [],
  text,
  onSortingSet = () => { },
  onPinnedFieldsSet = () => { },
  sortingState = {},
  pinnedFields = [],
  onDeleteCustomers = () => { },
  columnSetting,
  isBulkDeleteLoading,
  isSelectAllLoading,
  perPage = null,
  setPerPage = () => {},
}) => {
  const renderCustomFilter = useCallback(
    (field) => {
      switch (field?.field_type) {
        case "text":
          return (
            <CustomFilterText
              label={field?.friendly_name}
              placeholder={field?.friendly_name}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
              fields={customFilters}
            />
          );
        case "number":
          return (
            <CustomFilterNumber
              label={field?.friendly_name}
              placeholder={field?.friendly_name}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
            />
          );
        case "boolean":
          return (
            <CustomFilterBoolean
              label={field?.friendly_name}
              placeholder={field?.friendly_name}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
            />
          );
        case "multi_choice_radio":
          return (
            <CustomFilterMultiRadio
              label={field?.friendly_name}
              setting={field?.setting}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
            />
          );
        case "multi_choice":
          return (
            <CustomFilterMultiRadio
              label={field?.friendly_name}
              setting={field?.setting}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
            />
          );
        default:
          return (
            <CustomFilterText
              label={field?.friendly_name}
              placeholder={field?.friendly_name}
              field={field}
              onSetField={(val) => {
                onSetCustomFilters(val);
              }}
            />
          );
      }
    },
    [customFilters]
  );
  const dispatch = useDispatch();
  const prevTableData = useRef();
  const [_tableData, setTableData] = useState([]);
  const [perRow, setPerRow] = useState(25);

  const tableIds = useMemo(
    () => tableData?.map((client) => client?.id),
    [tableData]
  );

  const filters = useSelector((state) => state.customers.iBsFilters);
  // eslint-disable-next-line no-unused-vars
  const { currentPage, perPage: perPageFromFilters, ...currentFilters } = filters;
  const updateFilters = (data) => dispatch(thunks.setIBsFilters(data));

  useEffect(() => {
    if (perRow !== 25) {
      setPerRow(25);
    }
  }, [filters]);

  const router = useRouter();
  const { profiles } = useCallProfiles();
  const { user } = useAuth();
  const { makeCall, makeInternalCall, handleTwilioExtrasInit } = useTwilio();

  const [rule, setRule] = useState([]);
  const [updateFieldsOpen, setUpdateFieldsOpen] = useState(false);
  const [assignFormOpen, setAssignFormOpen] = useState(false);
  const [updateCustomFieldModalOpen, setEditCustomFieldModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentClientId, setCommentClientId] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [quickEmailInfo, setQuickEmailInfo] = useState({ customerId: undefined, brandId: undefined });
  const [EmailModalOpen, setEmailModalOpen] = useState(false);

  const [selectedFilterValue, setSelectedFilterValue] = useState(undefined);
  const [searchSetting, setSearchSetting] = useState([]);
  const [reminderClientId, setReminderClientId] = useState(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [customerToEditFields, setCustomerToEditFields] = useState(null);
  const [customerToEditField, setCustomerToEditField] = useState(null);
  const [fields, setFields] = useState([]);
  const [exchange, setExchange] = useState();

  const columnSettings = useMemo(() => {
    if (columnSetting) {
      setRule(JSON.parse(columnSetting)?.iBsTable ?? []);
      return JSON.parse(columnSetting);
    }
  }, [columnSetting]);

  useEffect(() => {
    const customersPerPage = localStorage.getItem("customersPerPage");

    if (customersPerPage) {
      updateFilters({ perPage: customersPerPage });
    }
  }, []);

  const hanldeGetExhange = async () => { 
    try {
      const res = await userApi.getExchange();
      setExchange(res?.exchange);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(()=> {
    hanldeGetExhange();
  }, []);

  const getFields = async () => {
    try {
      if (pinnedFields && pinnedFields?.length > 0) {
        const { client_field_value } =
          await customerFieldsApi.getCustomerFieldValue({
            client_id: commentClientId ?? customerToEditFields,
          });
        const valuableFields = customFilters
          ?.filter((field) => pinnedFields.includes(field?.custom_id))
          ?.map((field) => {
            const matchingValue = client_field_value?.find(
              (val) => val?.client_field_id === field?.custom_id
            );

            if (matchingValue) {
              return {
                ...field,
                field_value_id: matchingValue?.id,
                field_value: matchingValue?.value,
              };
            } else {
              return field;
            }
          });
        setFields(valuableFields);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (commentClientId) getFields();
  }, [customFilters, pinnedFields, commentClientId]);

  useEffect(() => {
    updateFilters({ currentPage: 0 });
    onDeselectAll()
  }, [customFilters]);

  const handleOpenEditCustomField = (rowId, fieldId) => {
    setEditCustomFieldModalOpen(true);
    setCustomerToEditFields(rowId);
    setCustomerToEditField(fieldId);
  }

  const renderEditButton = ({rowId, fieldId}, handleOpenEditCustomField ) => (
    <Tooltip title="Edit Custom Field">
      <IconButton
        edge="end"
        onClick={() => handleOpenEditCustomField(rowId, fieldId)}
        size="small"
        className="custom-field-edit"
        sx={{
          visibility: 'hidden',
          color: 'primary.main'
        }}
      >
        <Iconify icon="fluent:edit-12-regular" width={24} />
      </IconButton>
    </Tooltip>
  );

  const initCustomerFields = async (predefinedFieldType = null) => {
    setCustomFilterLoading(true);
    try {
      if (customFilters?.length === 0) {
        const res = await customerFieldsApi.getCustomerFields();
        if (res?.client_fields?.length) {
          onSetCustomFilters(
            res?.client_fields?.map((field, index) => {
              const accessKey = `acc_custom_v_${field?.value}`;
              const accessEditkey = `acc_custom_e_${field?.value}`;
              const viewAccess = user?.acc && user?.acc[accessKey];
              const editAccess = user?.acc && user?.acc[accessEditkey];

              if (viewAccess === undefined || viewAccess) {
                return {
                  id: field?.value,
                  label: field?.friendly_name,
                  enabled: true,
                  editAccess: editAccess,
                  custom: true,
                  custom_id: field?.id,
                  setting: field?.setting,
                  filter: null,
                  field_type: field?.field_type,
                  render: (row) => {
                    if (field?.field_type === "boolean") {
                      if (row?.client_fields[field?.id] === "true") {
                        return (
                          <Stack direction='row' alignItems='center' gap={1}>
                            <CheckCircleOutlineIcon
                              fontSize="small"
                              color="success"
                              className="custom-field-value"
                              sx={{verticalAlign: 'sub'}}
                            />
                            {renderEditButton({rowId: row.id, fieldId:field.id}, handleOpenEditCustomField)}
                          </Stack>
                        )
                      } else {
                        return renderEditButton({rowId: row.id, fieldId:field.id}, handleOpenEditCustomField);
                      }
                    } else if (field?.field_type === "multi_choice" || field?.field_type === "multi_choice_radio") {
                      const setting = field?.setting
                        ? JSON.parse(field?.setting)
                        : [];
                      const val = row?.client_fields[field?.id];
                      const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color ?? 'primary.main';

                      return (
                        <Stack direction='row' alignItems='center' gap={1}>
                          <Stack 
                            key={index} 
                            direction="row" 
                            alignItems="center" 
                            spacing={1} 
                            className="custom-field-value"
                          >
                            {(color && val) ? (
                              <Box
                                sx={{
                                  backgroundColor: color,
                                  maxWidth: 1,
                                  height: 1,
                                  padding: 1,
                                  borderRadius: 20,
                                }}
                              ></Box>
                            ) : null}
                            {val?.length > 15 ? (
                              <Tooltip title={val}>
                                <Typography>{val?.substring(0, 15) + ".."}</Typography>
                              </Tooltip>
                            ) : (
                              <Typography sx={{ whiteSpace: "nowrap" }}>
                                {val}
                              </Typography>
                            )}
                          </Stack>
                          {renderEditButton({rowId: row.id, fieldId:field.id}, handleOpenEditCustomField)}
                        </Stack>
                      );
                    }

                    if (row?.client_fields[field?.id]?.length > 15) {
                      return (
                        <Stack direction="row" alignItems="center" gap={1}>
                          {row?.client_fields[field?.id] && (
                            <Link
                              color="text.primary"
                              component={RouterLink}
                              href={`${paths.dashboard.customers.index}/${row?.id}`}
                              sx={{
                                alignItems: "center",
                                display: "inline-flex",
                              }}
                              underline="hover"
                              gap={1}
                            >
                              <Tooltip
                                key={index}
                                title={row?.client_fields[field?.id]}
                                className="custom-field-value"
                              >
                                <Typography>
                                  {row?.client_fields[field?.id]?.substring(0, 15) +
                                    "..." ?? ""}
                                </Typography>
                              </Tooltip>
                            </Link>
                          )}
                          {renderEditButton(
                            { rowId: row.id, fieldId: field.id },
                            handleOpenEditCustomField
                          )}
                        </Stack>
                      );
                    } else {
                      return (
                        <Stack direction="row" alignItems="center" gap={1}>
                          {row?.client_fields[field?.id] && (
                            <Link
                              color="text.primary"
                              component={RouterLink}
                              href={`${paths.dashboard.customers.index}/${row?.id}`}
                              sx={{
                                alignItems: "center",
                                display: "inline-flex",
                              }}
                              underline="hover"
                              gap={1}
                            >
                              {row?.client_fields[field?.id] ?? ""}
                            </Link>
                          )}
                          {renderEditButton(
                            { rowId: row.id, fieldId: field.id },
                            handleOpenEditCustomField
                          )}
                        </Stack>
                      );
                    }
                  },
                  headerRender: () => renderCustomFilter(field),
                };
              }
            })
          );
        }
      } else {
        onSetCustomFilters(
          customFilters?.map((field, index) => {
            const renderField = {
              ...field,
              id: field.custom_id,
              friendly_name: field.label,
              field_type: predefinedFieldType ? predefinedFieldType : field?.field_type,
            }
            let returnData = {
              ...field,
              render: (row) => {
                if (field?.field_type === "boolean") {
                  if (row?.client_fields[field?.custom_id] === "true") {
                    return (
                      <Stack direction='row' alignItems='center' gap={1}>
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          color="success"
                          className="custom-field-value"
                          sx={{verticalAlign: 'sub'}}
                        />
                        {renderEditButton({rowId: row.id, fieldId:field.id}, handleOpenEditCustomField)}
                      </Stack>
                    )
                  } else {
                    return renderEditButton({rowId: row.id, fieldId:field.id}, handleOpenEditCustomField);
                  }
                } else if (field?.field_type === "multi_choice" || field?.field_type === "multi_choice_radio") {
                  const setting = field?.setting
                  ? JSON.parse(field?.setting)
                  : [];
                  const val = row?.client_fields[field?.custom_id];
                  const color = setting.find((s) => s?.option?.trim() === val?.trim())?.color ?? 'primary.main';

                  return (
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Stack 
                        key={index} 
                        direction="row" 
                        alignItems="center" 
                        spacing={1} 
                        className="custom-field-value"
                      >
                        {(color && val) ? (
                          <Box
                            sx={{
                              backgroundColor: color,
                              maxWidth: 1,
                              height: 1,
                              padding: 1,
                              borderRadius: 20,
                            }}
                          ></Box>
                        ) : null}
                        {val?.length > 15 ? (
                          <Tooltip title={val}>
                            <Typography>{val?.substring(0, 15) + ".."}</Typography>
                          </Tooltip>
                        ) : (
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            {val}
                          </Typography>
                        )}
                      </Stack>
                      {renderEditButton({rowId: row.id, fieldId: field?.custom_id}, handleOpenEditCustomField)}
                    </Stack>
                  );
                }

                if (row?.client_fields[field?.custom_id]?.length > 15) {
                  return (
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Tooltip key={index} title={row?.client_fields[field?.custom_id]} className="custom-field-value">
                        <Typography>{row?.client_fields[field?.custom_id]?.substring(0, 15) + "..." ?? ""}</Typography>
                      </Tooltip>
                      {renderEditButton({rowId: row.id, fieldId:field?.custom_id}, handleOpenEditCustomField)}
                    </Stack>
                  )
                } else {
                  return (
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Typography key={index} className="custom-field-value">{row?.client_fields[field?.custom_id] ?? ""}</Typography>
                      {renderEditButton({rowId: row.id, fieldId:field?.custom_id}, handleOpenEditCustomField)}
                    </Stack> 
                  );
                }
              },
              headerRender: () => renderCustomFilter(renderField)
            }
            if (returnData.ok) {
              delete returnData.ok;
              return returnData;
            }
            else return { ...returnData, ok: 'ok' }
          })
        )
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setCustomFilterLoading(false);
  };

  useEffect(() => {
    if (JSON.stringify(prevTableData.current) !== JSON.stringify(tableData)) {
      setTableData(tableData);
      prevTableData.current = tableData;
    }
  }, [tableData]);

  useEffect(() => {
    initCustomerFields();
  }, []);

  const handleOpenCustomerChat = useCallback(
    (id) => {
      if (id) {
        router.push(paths.dashboard.chat + `?customer=${id}&returnTo=list`);
      }
    },
    [router]
  );

  const handleCustomerCall = useCallback(
    (numbers, id, callConversationId) => {
      const defaultProvider = profiles?.find((p) => p.is_default && p.enabled)
        ? profiles?.find((p) => p.is_default && p.enabled)
        : profiles?.filter((p) => p?.enabled)?.[0]
          ? profiles?.filter((p) => p?.enabled)?.[0]
          : { name: "Squaretalk" };
      if (defaultProvider?.name === "Twilio") {
        handleMakeTwilioCall(numbers, id, callConversationId);
      } else {
        handleMakeProviderCall(defaultProvider?.name, numbers);
      }
    },
    [profiles]
  );

  const handleMakeTwilioCall = useCallback(
    async (numbers, id, callConversationId) => {
      const response = await customersApi.getCustomerLastTicket({
        client_id: id,
      });
      const companyNumbersResponse = await chatApi.getCompanyPhoneNumbers({
        client_id: id,
      });

      const {
        ticket: { ticket },
      } = response;

      handleTwilioExtrasInit({
        conversation: callConversationId,
        token: ticket?.conversation?.token,
        ticket: ticket?.id,
        customer: ticket?.client_id,
      });

      makeInternalCall({
        target_id: `conversation_internal_${callConversationId}_${user.id}`,
      });

      setTimeout(() => {
        makeCall({
          target_id: `phone_${callConversationId}_${numbers?.[0]}_${companyNumbersResponse?.phone_numbers?.[0]?.id}_${user.id}`,
        });
      }, 3000);
    },
    [user, makeCall, makeInternalCall]
  );

  const handleMakeProviderCall = useCallback(async (provider, numbers) => {
    try {
      // const NAME_TO_ID = {
      //   Twilio: 1,
      //   Coperato: 2,
      //   Voiso: 3,
      //   "Cyprus pbx": 4,
      //   Squaretalk: 5,
      //   Commpeak: 6,
      //   MMDsmart: 7,
      //   Voicespin: 9,
      // };

      await settingsApi.callRequest({
        phone_number: numbers?.[0],
      });
      toast(`${provider} call has started!`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const selectedSome =
    tableIds?.some((item) => selected?.includes(item)) &&
    !tableIds?.every((item) => selected?.includes(item));

  const { tableColumn, defaultColumn } = useGetCustomerColumns(
    {
      rule,
      setRule,
      customFilters,
      columnSettings,
      onDeselectAll,
      handleReminder: (id) => {
        setReminderClientId(id);
        setReminderOpen(true);
      },
      onGetData,
      handleSelectedLabelsGet,
      handleLabelsDialogOpen,
      setCustomerToEditFields: (id) => {
        setUpdateFieldsOpen(true);
        setCustomerToEditFields(id);
      },
      assignCustomerForms: (id) => {
        setAssignFormOpen(true);
        setCustomerToEditFields(id);
      },
      handleCustomerCall,
      handleOpenCustomerChat,
      setCommentClientId: (id) => {
        setCommentClientId(id);
        setModalOpen(true);
      },
      setMessageId: (id) => {
        setMessageId(id);
        setMessageModalOpen(true);
      },
      setQuickEmailInfo: (id) => {
        setQuickEmailInfo(id);
        setEmailModalOpen(true);
      },
    });

  const onCommentSubmit = async (data) => {
    try {
      const request = {
        client_id: commentClientId,
        comment: data?.comment,
      };
      const { comments } = await commentsApi.createComment(request);
      const clientsWithComments = _tableData?.map((td) => {
        if (td?.id === comments?.[comments?.length - 1]?.client_id) {
          return {
            ...td,
            client_comments: comments,
          };
        } else {
          return td;
        }
      });

      setTableData(clientsWithComments);
      setModalOpen(false);
      toast.success("Client comment successfully created!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleCreateSms = async (sms, source_sms_number) => {
    try {
      const request = {
        conversation_id: messageId,
        description: sms,
        row_text: sms,
        send_sms: true,
      };
      if (source_sms_number) request["source_sms_number"] = source_sms_number;
      const { message } = await chatApi.sendMessage(request);
      toast.success("SMS successfully sent!");

      const clientsWithSms = _tableData?.map((td) => {
        if (td?.sms_conversation_id === messageId) {
          return {
            ...td,
            sms_messages: [...td?.sms_messages, message],
          };
        } else {
          return td;
        }
      });

      setTableData(clientsWithSms);

      setMessageId(null);
      setMessageModalOpen(false);
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <>
      <CustomerTableToolbar
        isLoading={isLoading}
        onGetData={onGetData}
        onSetCustomFilters={onSetCustomFilters}
        customFilters={customFilters}
        query={query}
        selectAll={selectAll}
        selected={selected}
        setText={setText}
        text={text}
        onSortingSet={onSortingSet}
        onPinnedFieldsSet={onPinnedFieldsSet}
        sortingState={sortingState}
        pinnedFields={pinnedFields}
        defaultColumn={defaultColumn}
        tableColumn={tableColumn}
        selectedFilterValue={selectedFilterValue}
        setSelectedFilterValue={setSelectedFilterValue}
        rule={rule}
        setRule={setRule}
        columnSettings={columnSettings}
        setSearchSetting={setSearchSetting}
        searchSetting={searchSetting}
        renderCustomFilter={renderCustomFilter}
        onInitCustomFields={initCustomerFields}
        selectFirstPerPage={perPage}
      />
      <FilterChips
        onDeselectAll={() => {
          setSelectedFilterValue(undefined);
          onDeselectAll();
        }}
        onSetCustomFilters={onSetCustomFilters}
        customFilters={customFilters}
        searchSetting={searchSetting}
        selectedFilterValue={selectedFilterValue}
      />
      <Box sx={{ position: "relative" }} className="customer_table">
        <StyledInfiniteScroll
          className='customer-table'
          dataLength={perRow ?? 0}
          next={() => {
            setPerRow(prev => prev + 10);
          }}
          hasMore={perRow < _tableData?.length ? true : false}
          height={(hasFilter(currentFilters) || hasCustomFilter(customFilters)) ? window.innerHeight - 444 : window.innerHeight - 383}
          loader={
            <LinearProgress color="primary" sx={{ width: 1 }} />
          }
          scrollableTarget='scrollableDiv'
        >
          <Table sx={{ minWidth: 700, position: "relative" }}>
            <CustomerTableHeader
              selected={selected}
              selectAll={selectAll}
              isLoading={isLoading && _tableData?.length == 0}
              selectedSome={selectedSome}
              onDeselectPage={onDeselectPage}
              onSelectPage={onSelectPage}
              onSortingSet={onSortingSet}
              sortingState={sortingState}
              columnSettings={columnSettings}
              tableIds={tableIds}
              tableColumn={tableColumn}
              rule={rule}
            />
            <TableRow sx={{ position: "sticky", top: 64, zIndex: 1000 }}>
              <TableCell colSpan={tableColumn?.filter(item => item?.enabled).length + 1} align="center" sx={{ padding: 0 }}>
                <Suspense>
                  <Stack sx={{ display: selected.length > 0 ? "block" : "none", borderTop: '1px solid', borderColor: 'divider' }}>
                    <CustomerBulkActions
                      count={count}
                      handleLabelsDialogOpen={handleLabelsDialogOpen}
                      handleSelectedLabelsChange={handleSelectedLabelsChange}
                      onDeselectAll={onDeselectAll}
                      onSelectAll={onSelectAll}
                      selected={selected}
                      selectAll={selectAll}
                      onGetData={onGetData}
                      customFilters={customFilters}
                      selectedLabels={selectedLabels}
                      onPinnedFieldsSet={onPinnedFieldsSet}
                      pinnedFields={pinnedFields}
                      onDeleteCustomers={onDeleteCustomers}
                      columnSettings={columnSettings}
                      isBulkDeleteLoading={isBulkDeleteLoading}
                      isSelectAllLoading={isSelectAllLoading}
                      query={query}
                      perPage={perPage}
                      setPerPage={setPerPage}
                    />
                  </Stack>
                </Suspense>
              </TableCell>
            </TableRow>
            <TableBody>
              {isLoading && _tableData?.length == 0 ? (
                <TableSkeleton
                  rowCount={15}
                  cellCount={
                    tableColumn?.filter((item) => item.enabled)?.length + 1
                  }
                  padding={"1px"}
                />
              ) : (
                _tableData?.slice(0, perRow)?.map((customer, index) => {
                  const client = customer;
                  const isSelected = selected.includes(customer?.id);
                  return (
                    <CustomerTableRow
                      isSelected={isSelected}
                      client={client}
                      index={index}
                      customer={customer}
                      onSelectOne={onSelectOne}
                      onDeselectOne={onDeselectOne}
                      tableColumn={tableColumn}
                      customFilters={customFilters}
                      rule={rule}
                      exchange={exchange}
                      selectAll={selectAll}
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledInfiniteScroll>
        {_tableData?.length === 0 && !isLoading && (
          <Stack
            sx={{
              position: "absolute",
              top: 60,
              bottom: 60,
              height: 485,
              width: 1,
            }}
          >
            <TableNoData />
          </Stack>
        )}
        <Divider />
        <CustomerTablePagination count={count} />
      </Box>

      <BulkUpdateFields
        open={updateFieldsOpen}
        onClose={() => {
          setUpdateFieldsOpen(false);
          setCustomerToEditFields(null);
        }}
        onGetFields={getFields}
        customFilters={customFilters}
        selectAll={selectAll}
        selected={selected}
        onGetData={onGetData}
        customerId={customerToEditFields}
        pinedFields={pinnedFields}
        setPinedFields={onPinnedFieldsSet}
        columnSettings={columnSettings}
        query={query}
        perPage={perPage}
        setPerPage={setPerPage}
      />

      <CustomerAssignFormDialog 
        open={assignFormOpen}
        onClose={() => {
          setAssignFormOpen(false);
        }}
        filters={filters}
        customFilters={customFilters}
        selectAll={selectAll}
        selected={selected}
        customerId={customerToEditFields}
        onDeselectAll={onDeselectAll}
      />

      <EditCustomFieldModal
        open={updateCustomFieldModalOpen}
        onClose={() => {
          setEditCustomFieldModalOpen(false);
          setCustomerToEditFields(null);
          setCustomerToEditField(null);
        }}
        onGetFields={getFields}
        customFilters={customFilters}
        onGetData={onGetData}
        customerId={customerToEditFields}
        customFieldId={customerToEditField}
      />

      <ChatReminderDialog
        open={reminderOpen}
        onClose={() => {
          setReminderOpen(false);
          setReminderClientId(null);
        }}
        clientId={reminderClientId}
      />

      <CustomerCreateComment
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCommentClientId(null);
        }}
        onCommentCreate={onCommentSubmit}
        fields={fields}
        customerId={commentClientId}
        onGetData={onGetData}
        onFieldsOpen={(customer) => {
          setUpdateFieldsOpen(true);
          setCustomerToEditFields(customer);
        }}
      />

      {messageId ? (
        <CustomerCreateSms
          open={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setMessageId(null);
          }}
          onSmsCreate={handleCreateSms}
        />
      ) : null}

      <CustomerCreateQuickEmail
        quickEmailInfo={quickEmailInfo}
        open={EmailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setQuickEmailInfo({ customerId: undefined, brandId: undefined });
        }}
      />
    </>
  );
};

export const CustomerListTable = memo(_CustomerListTable);
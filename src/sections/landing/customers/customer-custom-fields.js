import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { reorder } from "src/utils/function";
import { useForm } from "react-hook-form";
import { SelectMenu } from "src/components/customize/select-menu";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import CustomSwitch from "src/components/customize/custom-switch";

export const LandingCustomerCustomFields = () => {
  const { control, setValue } = useForm();

  const syncedMockedDataList = [
    {
      id: 1,
      label: 'Offer',
      type: "text",
    },
    {
      id: 2,
      label: 'Case Notes',
      type: "text",
    },
    {
      id: 3,
      label: 'Status',
      type: "single_choice",
      options: [
        { label: "Completed", value: 1 },
        { label: "Pending", value: 2 },
        { label: "Canceled", value: 3 }
      ],
    },
    {
      id: 4,
      label: 'Review',
      type: "boolean",
    },
    {
      id: 5,
      label: 'Skill Team',
      type: "multi_choice",
      options: [
        { label: "Dev Team", value: 1, color: "#3366FF" },
        { label: "QA Team", value: 2, color: '#06AED4' },
        { label: "Design Team", value: 3, color: '#FFC300' },
      ],
    },
  ];

  const unSyncedMockedDataList = [
    {
      id: 11,
      label: 'Service',
      type: "multi_choice",
      options: [
        { label: "Marketing", value: 4, color: "#ff9800" },
        { label: "Sales", value: 5, color: "#4caf50" },
        { label: "Support", value: 6, color: "#2196f3" },
      ],
    },
    {
      id: 6,
      label: 'Deadline',
      type: "date",
    },
    {
      id: 7,
      label: 'Attachments',
      type: "text",
    },
    {
      id: 8,
      label: 'Priority',
      type: "single_choice",
      options: [
        { label: "High", value: 1 },
        { label: "Medium", value: 2 },
        { label: "Low", value: 3 }
      ],
    },
    {
      id: 9,
      label: 'Feedback',
      type: "text",
    },
    {
      id: 10,
      label: 'Assignee',
      type: "text",
    },
  ];

  const [syncedField, setSyncedField] = useState(syncedMockedDataList);
  const [unSyncedField, setUnSyncedField] = useState(unSyncedMockedDataList);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      syncedField,
      result.source.index,
      result.destination.index
    );
    setSyncedField(newTableData);
  };

  const onUnSyncDragEnd = (result) => {
    if (!result.destination) return;
    const newTableData = reorder(
      unSyncedField,
      result.source.index,
      result.destination.index
    );
    setUnSyncedField(newTableData);
  };

  useEffect(() => {
    setValue('Service', [4, 5]);
    setValue('Priority', 1);
    setValue('Status', 1);
    setValue('Skill Team', [1]);
  }, [syncedMockedDataList, unSyncedMockedDataList])

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ pr: 1 }}>
              Custom Field
            </Typography>
            <Tooltip title="Edit custom fields">
              <IconButton >
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent>
        <Stack spacing={5}>
          <Stack spacing={3} sx={{ minHeight: 420 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Synced</Typography>
              <Tooltip title="Set as Default Order">
                <IconButton onClick={() => setSyncedField(syncedMockedDataList)}>
                  <LowPriorityIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {({ innerRef }) => (
                  <Stack spacing={2} ref={innerRef}>
                    {syncedField?.map((field, index) => (
                      <Draggable
                        key={`signature-row-${index}`}
                        draggableId={`signature-row-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <Stack
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {field?.type === "text" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <OutlinedInput
                                  sx={{ maxWidth: "215px" }}
                                  placeholder={field?.label}
                                />
                              </Stack>
                            )}
                            {field?.type === "single_choice" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1 }}>
                                  <SelectMenu
                                    control={control}
                                    name={field?.label}
                                    list={field?.options}
                                  />
                                </Stack>
                              </Stack>
                            )}
                            {field?.type === "multi_choice" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1 }}>
                                  <MultiSelectMenu
                                    placeholder='Select Skill Team'
                                    control={control}
                                    name={field?.label}
                                    list={field?.options}
                                  />
                                </Stack>
                              </Stack>
                            )}
                            {field?.type === "boolean" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1, justifyContent: "center" }}>
                                  <CustomSwitch control={control} name="enabled" />
                                </Stack>
                              </Stack>
                            )}
                          </Stack>
                        )}
                      </Draggable>
                    ))}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
          <Stack spacing={3} sx={{ minHeight: 450 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Unsynced</Typography>
              <Tooltip title="Set as Default Order">
                <IconButton onClick={() => setUnSyncedField(unSyncedMockedDataList)}>
                  <LowPriorityIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <DragDropContext onDragEnd={onUnSyncDragEnd}>
              <Droppable droppableId="droppable">
                {({ innerRef }) => (
                  <Stack spacing={2} ref={innerRef}>
                    {unSyncedField?.map((field, index) => (
                      <Draggable
                        key={`signature-row-${index}`}
                        draggableId={`signature-row-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <Stack
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {field?.type === "text" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <OutlinedInput
                                  sx={{ maxWidth: "215px" }}
                                  placeholder={field?.label}
                                />
                              </Stack>
                            )}
                            {field?.type === "single_choice" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1 }}>
                                  <SelectMenu
                                    control={control}
                                    name={field?.label}
                                    list={field?.options}
                                  />
                                </Stack>
                              </Stack>
                            )}
                            {field?.type === "multi_choice" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1 }}>
                                  <MultiSelectMenu
                                    placeholder='Select Skill Team'
                                    control={control}
                                    name={field?.label}
                                    list={field?.options}
                                  />
                                </Stack>
                              </Stack>
                            )}
                            {field?.type === "boolean" && (
                              <Stack
                                key={field?.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ maxWidth: "500px" }}
                              >
                                <Stack direction="row" gap={1}>
                                  <DragIndicatorIcon />
                                  <Typography>
                                    {field?.label}:
                                  </Typography>
                                </Stack>
                                <Stack sx={{ maxWidth: "215px", width: 1, justifyContent: "center" }}>
                                  <CustomSwitch control={control} name="enabled" />
                                </Stack>
                              </Stack>
                            )}
                          </Stack>
                        )}
                      </Draggable>
                    ))}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

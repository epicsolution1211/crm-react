import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { countries } from "src/utils/constant";
import { injectionMockedList } from "src/utils/constant/mock-data";
import { paths } from "src/paths";
import { useSelection } from "src/hooks/use-selection";

const Page = () => {
  const [text, setText] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const tableIds = useMemo(
    () => injectionMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((lead) => lead?.id),
    [injectionMockedList, currentPage, perPage]
  );

  const selection = useSelection(injectionMockedList?.map((item) => item?.id) ?? [], (message) => {
    toast.error(message);
  });

  const enableBulkActions = selection.selected?.length > 0;
  const selectedPage = tableIds?.every((item) =>
    selection.selected?.includes(item)
  );
  const selectedSome =
    tableIds?.some((item) => selection.selected?.includes(item)) &&
    !tableIds?.every((item) => selection.selected?.includes(item));

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.injection.index}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          {row?.id}
        </Link>
      ),
    },
    {
      id: "name",
      label: "Name",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.injection.index}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          {row?.name}
        </Link>
      ),
    },
    {
      id: "brand",
      label: "Brand",
      enabled: true,
    },
    {
      id: "affiliate",
      label: "Affiliate",
      enabled: true,
    },
    {
      id: "team",
      label: "TEAM",
      enabled: true,
    },
    {
      id: "agent",
      label: "Agent",
      enabled: true,
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      render: (row) =>
        row?.client_labels?.map((item, index) => (
          <Chip
            key={index}
            label={item.name}
            size="small"
            color="primary"
            sx={{
              backgroundColor:
                item?.color ?? "",
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "country",
      label: "Country",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.country?.toLowerCase()}`} width={24} />
          <Typography variant="subtitle2">{countries?.find((item) => item?.code === row?.country)?.label}</Typography>
        </Stack>
      ),
    },
    {
      id: "dripping",
      label: "DRIPPING",
      enabled: true,
      render: (row) => (
        <SeverityPill color={row?.dripping ? "success" : "error"}>
          {row?.dripping ? "Active" : "InActive"}
        </SeverityPill>
      ),
    },
    {
      id: "internal_id",
      label: "Internal ID",
      enabled: true,
    },
    {
      id: "total_count",
      label: "TOTAL COUNT",
      enabled: true,
    },
    {
      id: "validated_count",
      label: "VALIDATED COUNT",
      enabled: true,
    },
    {
      id: "invalid_count",
      label: "INVALID COUNT",
      enabled: true,
      render: (row) => row?.total_count - row?.validated_count,
    },
    {
      id: "duplicate_emails",
      label: "DUPLICATE EMAILS",
      enabled: true,
    },
    {
      id: "duplicate_phones",
      label: "DUPLICATE PHONES",
      enabled: true,
    },
    {
      id: "created_at",
      label: "CREATED AT",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">{format(new Date(row?.created_at), "yyyy-MM-dd")}</Typography>
      )
    }
  ];

  return (
    <>
      <Seo title="Lead Management : List Injection" />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">List Injection</Typography>
              <Button
                component={RouterLink}
                href={paths.dashboard.lead.injection.create}
                startIcon={<Iconify icon="lucide:plus" width={24} />}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          </Stack>
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Iconify icon="lucide:search" color="text.secondary" width={24} />
              <Box sx={{ flexGrow: 1 }}>
                <Input
                  value={text}
                  onChange={(event) => setText(event?.target?.value)}
                  disableUnderline
                  fullWidth
                  placeholder="Enter a keyword"
                />
              </Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title="Reload Table">
                  <IconButton>
                    <Iconify icon="ion:reload-sharp" width={24}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Search Setting">
                  <IconButton>
                    <Iconify icon="tabler:filter-cog" width={24}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table Setting">
                  <IconButton>
                    <Iconify icon="ion:settings-outline" width={24}/>
                  </IconButton>
                </Tooltip>
                {enableBulkActions &&
                  <Tooltip title="Export selected">
                    <IconButton>
                      <Iconify icon="line-md:downloading-loop" width={24}/>
                    </IconButton>
                  </Tooltip>}
              </Stack>
            </Stack>
            <Box sx={{ position: "relative" }}>
              {enableBulkActions ? (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "neutral.800"
                        : "neutral.50",
                    display: enableBulkActions ? "flex" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    px: 2,
                    py: 0.5,
                    zIndex: 50,
                  }}
                >
                  <Checkbox
                    sx={{ p: 0 }}
                    checked={selectedPage}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        if (selectedSome) {
                          selection.handleDeSelectPage(tableIds);
                        } else {
                          selection.handleSelectPage(tableIds);
                        }
                      } else {
                        selection.handleDeSelectPage(tableIds);
                      }
                    }}
                  />
                  {selection.selectAll ? (
                    <Typography>
                      Selected all <strong>{injectionMockedList?.length}</strong> items
                    </Typography>
                  ) : (
                    <Typography>
                      Selected <strong>{selection.selected?.length}</strong>{" "}
                      of <strong>{injectionMockedList?.length}</strong>
                    </Typography>
                  )}
                  {!selection.selectAll && (
                    <Button onClick={() => selection.handleSelectAll()}>
                      <Typography sx={{ whiteSpace: "nowrap" }}>Selected All</Typography>
                    </Button>
                  )}
                  <Button onClick={() => selection.handleDeselectAll()}>
                    <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
                  </Button>
                </Stack>
              ) : null}
              <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow sx={{ whiteSpace: "nowrap" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={false}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selection.handleSelectPage(tableIds);
                            } else {
                              selection.handleDeSelectPage(tableIds);
                            }
                          }}
                        />
                      </TableCell>
                      {defaultColumn
                        ?.map((item) => (
                          <TableCell key={item.id}>
                            {item.headerRender ? (
                              item.headerRender()
                            ) : (
                              <Typography
                                sx={{ fontSize: 14, fontWeight: "600" }}
                              >
                                {item.label}
                              </Typography>
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      injectionMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((injection) => {
                        const isSelected = selection.selected.includes(
                          injection?.id
                        );
                        return (
                          <TableRow
                            key={injection?.id}
                            hover
                            selected={isSelected}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                sx={{ p: 0 }}
                                checked={isSelected}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    selection.handleSelectOne?.(
                                      injection?.id
                                    );
                                  } else {
                                    selection.handleDeselectOne?.(
                                      injection?.id
                                    );
                                  }
                                }}
                                value={isSelected}
                              />
                            </TableCell>
                            {defaultColumn
                              ?.map((header, index) => (
                                <TableCell key={injection.id + index}>
                                  {header?.render
                                    ? header?.render(injection)
                                    : injection[header.id]}
                                </TableCell>
                              ))}
                          </TableRow>
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </Scrollbar>
              <TablePagination
                component="div"
                labelRowsPerPage="Per page"
                count={injectionMockedList?.length ?? 0}
                page={currentPage ?? 0}
                rowsPerPage={perPage ?? 10}
                onPageChange={(event, index) => setCurrentPage(index)}
                onRowsPerPageChange={(event) =>
                  setPerPage(event?.target?.value)
                }
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Page;

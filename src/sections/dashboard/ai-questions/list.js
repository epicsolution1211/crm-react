import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";

import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { Iconify } from "src/components/iconify";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";
import { ClientFilterInput } from "src/components/customize/client-filter-input";
import { useMemo, useState } from "react";
import { ChipSet } from "src/components/customize/chipset";
import { copyToClipboard } from "src/utils/copy-to-clipboard";

const AnswerRenderContent = ({ answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Typography
        variant="body2"
        sx={
          !isOpen
            ? {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                maxWidth: 1500,
              }
            : {}
        }
        component="div"
        dangerouslySetInnerHTML={{ __html: answer ?? "" }}
      />
      <Stack direction="row" alignItems="center">
        <Tooltip title={isOpen ? "Collapse" : "Expand"}>
          <IconButton onClick={() => setIsOpen(!isOpen)} color="primary" size="small">
            <Iconify icon={isOpen ? "mynaui:chevron-double-up" : "mynaui:chevron-double-down"} width={24}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy to clipboard">
          <IconButton color="primary" size="small" onClick={() => {
            copyToClipboard(answer);
          }}>
            <Iconify icon="material-symbols-light:content-copy-outline" width={24}/>
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export const AIQuestionsTable = ({
  count = 0,
  onPageChange = () => { },
  onRowsPerPageChange,
  page = 0,
  rowsPerPage = 0,
  questions = [],
  isLoading = false,
  searchText = '',
  onSearch = () => {},
  onReload,
  setSelectedClient = () => {},
  selectedClient,
}) => {

  const columns = [
    {
      id: 'id',
      label: 'ID',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" noWrap>
          {row.id}
        </Typography>
      )
    },
    {
      id: "client_id",
      label: "Client",
      enabled: true,
      headerRender: () => (
        <ClientFilterInput 
          updateFilters={(val) => {
            if(val.client_ids.length > 0) {
              setSelectedClient(val.client_ids[0]);
            } else {
              setSelectedClient(null);
            }
          }}
        />
      ),
      render: (row) => (
        row?.client_id ?
        (<Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.customers.index}/${row?.client_id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
          gap={1}
        >
          <Typography>{row?.client_name ?? row?.client_id ?? ''}</Typography>
        </Link>)
        :
        null
      ),
    },
    {
      id: 'question',
      label: 'Question',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" noWrap>
          {row.question.endsWith('?') ? row.question : `${row.question}?`}
        </Typography>
      )
    },
    {
      id: 'answer',
      label: 'Answer', 
      enabled: true,
      render: (row) => {
        return (
          <AnswerRenderContent answer={row?.answer} />
        );
      }
    },
  ];

  const clientIdChip = useMemo(
    () =>
      selectedClient > 0 ? [{
        displayValue: selectedClient,
        value: selectedClient,
        label: "Client ID",
      }] : [],
    [selectedClient]
  );
  
  return (
    <Box sx={{ position: "relative" }}>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ py: 1, px: 2 }}>
        <SvgIcon>
          <SearchIcon />
        </SvgIcon>
        <Box sx={{ flexGrow: 1 }}>
          <Input
            disableUnderline
            fullWidth
            value={searchText}
            onChange={(event) => {
              onSearch(event.target.value);
            }}
            placeholder="Search questions..."
          />
        </Box>
        <Stack direction='row' alignItems='center' gap={1}>
          <Tooltip title="Reload Table">
            <IconButton
              onClick={() => {
                if(isLoading) return;
                onReload();
              }}
              sx={{ 
                '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, 
                transition: 'transform 0.3s', 
                color:  isLoading ? 'primary.main' : 'text.secondary',
                cursor: isLoading ? 'default' : 'pointer',
              }}
            >
              <Iconify icon={ isLoading ? "svg-spinners:8-dots-rotate" : "ion:reload-sharp"} width={24}/>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider />
      {selectedClient > 0 && 
      (<Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2 }}>
        <ChipSet
          chips={clientIdChip}
          handleRemoveChip={() => setSelectedClient(null)}
        />
      </Stack>)}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {columns
                .filter((column) => column.enabled)
                .map((column) => (
                  <TableCell key={column.id}> {column.headerRender ? column.headerRender() : column.label}
                    
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                cellCount={columns.filter((col) => col.enabled).length}
                rowCount={rowsPerPage > 15 ? 15 : rowsPerPage}
              />
            ) : (
              questions.map((question, index) => (
                <TableRow hover key={index}>
                  {columns
                    .filter((column) => column.enabled)
                    .map((column) => (
                      <TableCell
                        key={`${question.id}-${column.id}`}
                        sx={{ whiteSpace: column.id === 'answer' ? 'normal' : 'nowrap' }}
                      >
                        {column.render ? column.render(question) : question[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      {questions.length === 0 && !isLoading && <TableNoData />}
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(event, value) => onPageChange(value)}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage ?? 5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};
import React, { useEffect, useState } from 'react';

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";

import CustomModal from "src/components/customize/custom-modal";
import { Scrollbar } from 'src/components/scrollbar';
import { TableSkeleton } from 'src/components/table-skeleton';
import { riskApi } from 'src/api/risk';
import { useTimezone } from "src/hooks/use-timezone";

export const SwapModal = ({open, onClose, positionId}) => {
  const { toLocalTime } = useTimezone();

  const [swapInfo, setSwapInfo]= useState([]);
  const [isLoading, setIsLoading]= useState(true);

  const hanldeGetSwap = async (positionId) => {
    setIsLoading(true);
    const res = await riskApi.getSwapInfo({ position_id: positionId });
    setSwapInfo(res?.swaps??[]);
    setTimeout(()=> {
      setIsLoading(false);
    }, 500)
  }

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const resetInfo = () => {
    setSwapInfo([]);
  }

  useEffect(() => {
    resetInfo();
  }, [open])

  useEffect(() => {
    if(positionId) {
      hanldeGetSwap(positionId);
    }

    return () => resetInfo()
  }, [positionId])

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "ID",
      enabled: true,
    },
    {
      id: "date",
      label: "Date",
      enabled: true,
      render: (row) => (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {toLocalTime(row?.created_at)}
        </Typography>
      ),
    },
    {
      id: "swap_amount",
      label: "Amount",
      enabled: true,
    },
  ];

  return (
    <CustomModal width={500} onClose={() => onClose()} open={open}>
      <Stack>
        <Typography
          id="modal-modal-title"
          align="center"
          sx={{ fontSize: 22, fontWeight: "bold", mt: 1, mb:2 }}
        >
          Swap Info
        </Typography>
        <Scrollbar sx={{ minHeight: 315 }}>
          <Table>
            <TableHead>
              <TableRow>
                {DEFAULT_COLUMN?.map((item) => (
                  <TableCell key={`${item.id}-header`}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton
                  cellCount={3}
                  rowCount={5}
                />
              ) : 
              (swapInfo?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((swap) => (
                <TableRow hover key={`${swap.id}-client`}>
                  {DEFAULT_COLUMN
                    ?.map((column, index) => (
                      <TableCell
                        key={`${swap?.id + index}-row`}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {column?.render
                          ? column?.render(swap)
                          : swap[column?.id]}
                      </TableCell>
                    ))}
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </Scrollbar>
        {isLoading && <Divider/>}
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={swapInfo?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 5}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10]}
        />
      </Stack>
  </CustomModal>
  )
}

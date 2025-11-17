import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from "src/components/scrollbar";
import IconButton from "@mui/material/IconButton";

export const ResultStep = ({ onClose, importData, onBack }) => {
  return (
    <Stack>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {importData?.map((item) => (
              <TableRow key={item?.email}>
                <TableCell>{item?.email}</TableCell>
                <TableCell>{item?.first_name}</TableCell>
                <TableCell>{item?.last_name}</TableCell>
                <TableCell>{item?.password}</TableCell>
                <TableCell>
                  {item?.status === "pending" ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" fontWeight={600}>
                        Pending
                      </Typography>
                      <CircularProgress size={18} />
                    </Stack>
                  ) : item?.status === "in progress" ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" fontWeight={600}>
                        In Progress
                      </Typography>
                      <CircularProgress size={18} />
                    </Stack>
                  ) : item?.status === "done" ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="green"
                      >
                        Done
                      </Typography>
                    </Stack>
                  ) : item?.status === "error" ? (
                    <Stack direction="row" alignItems="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="red"
                      >
                        Error
                      </Typography>
                      {item?.error ? (
                        <Tooltip title={item?.error}>
                          <IconButton>
                            <Iconify icon="ph:warning" color="red" width={20}/>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title={"Error"}>
                          <IconButton size="small">
                            <Iconify icon="ph:warning" color="red" width={20}/>
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button variant="contained" onClick={onClose}>
            Finish
          </Button>
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
        </Stack>
    </Stack>
  );
};

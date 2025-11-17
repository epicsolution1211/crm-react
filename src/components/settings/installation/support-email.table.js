import { useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";

import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from 'src/components/scrollbar';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { getAPIUrl } from 'src/config';

export const SupportEmailTable = ({ company, teams, members }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const tableData = useMemo(()=> {
    let result = [];
    if (teams?.length > 0) {
      result = [...result, ...teams?.map((team)=> ({
        id: team?.team?.id ?? '',
        avatar: company?.avatar ?? '',
        name: team?.team?.name ?? '',
        email: company?.email_domain?  `${team?.team?.name}@${company?.email_domain ? company?.email_domain : ""}` : null,
        forwardEmail: team?.team?.email_token ? `${team?.team?.email_token}@email.octolit.com` : undefined,
      }))];
    }
    if (members?.length > 0) {
      result = [...result, ...members?.map((member)=> ({
        id: member?.id ?? '',
        avatar: member?.avatar ?? '',
        name: member?.first_name ? `${member?.first_name} ${member?.last_name}` : `${member?.email}`,
        email: member?.email ?? '',
        forwardEmail: member.email_token ? `${member.email_token ? member.email_token : ""}@email.octolit.com` : undefined,
      }))];
    }
    return result ?? [];
  }, [teams, members, company]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell >
                Member
              </TableCell>
              <TableCell >
                Email
              </TableCell>
              <TableCell >
                Forward Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((data) => (
              <TableRow
                hover
                key={data?.id}
              >
                <TableCell>
                  <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="start"
                    spacing={1}
                  >
                    <Avatar
                      src={data?.avatar ? data?.avatar?.includes('http') ? data?.avatar : `${getAPIUrl()}/${data?.avatar}` : ""}
                      sx={{
                        height: 42,
                        width: 42
                      }}
                    >
                    </Avatar>
                    <Typography sx={{ fontSize: 14 }}>{data?.name??""}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {data?.email??""}
                </TableCell>
                <TableCell>
                  {data?.forwardEmail ?
                    <Stack direction="row" alignItems="center">
                      <Typography variant='subtitle2'>
                        {data?.forwardEmail ??""}
                      </Typography>
                      <IconButton
                        edge="end"
                        onClick={() => copyToClipboard(data?.forwardEmail)}
                      >
                        <ContentCopyIcon
                          color="success"
                          fontSize="small" />
                      </IconButton>
                    </Stack>
                    : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
        <PageNumberSelect 
          currentPage={currentPage} 
          totalPage={tableData?.length ? Math.ceil(tableData?.length/perPage) : 0}
          onUpdate={setCurrentPage}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={tableData?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>
    </Box>
  );
};


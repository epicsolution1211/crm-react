import { useParams } from "react-router";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { PageNumberSelect } from "src/components/pagination/page-selector";

export const BlogListView = (props) => {
  const {
    posts,
    onPageChange = () => { },
    count,
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const params = useParams();

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Labels</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts?.map((post) => {
              return (
                <TableRow key={post?.id}>
                  <TableCell>{post?.id}</TableCell>
                  <TableCell>
                    <Link
                      color="text.primary"
                      component={RouterLink}
                      href={`/public/${params?.companyId}/articles/${post?.id}`}
                      sx={{
                        alignItems: "center",
                        display: "inline-flex",
                      }}
                      underline="hover"
                      gap={1}
                    >
                      {post?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {post?.article_labels?.map((label) => (
                        <Chip
                          label={label?.name}
                          sx={{ background: label?.color }}
                          key={label?.id}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
        <PageNumberSelect 
          currentPage={page} 
          totalPage={count? Math.ceil(count/rowsPerPage) : 0}
          onUpdate={onPageChange}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={count}
          onPageChange={(event, index)=> onPageChange(index)}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Stack>
    </Box>
  );
};

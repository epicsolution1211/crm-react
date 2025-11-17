import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { blogApi } from "src/api/blog";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";

export const BlogListView = (props) => {
  const {
    posts,
    onPageChange = () => { },
    count,
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    onPostsGet = () => { },
    labelList,
    setLabels,
    labels,
    setCurrentPage,
  } = props;

  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEdit = useCallback(
    (id) => {
      router.push(
        paths.dashboard.article.articleEdit.replace(":articleId", id)
      );
    },
    [router]
  );

  const handleDeleteModalOpen = useCallback((id) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeletePost = useCallback(async () => {
    try {
      setIsDeleting(true);
      await blogApi.deleteArticle(postToDelete);
      toast.success("Article successfully deleted");
      setDeleteModalOpen(false);
      setPostToDelete(null);
      setTimeout(() => onPostsGet(), 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  }, [postToDelete, onPostsGet]);

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>
                <FilterMultiSelect
                  label="LABELS"
                  withSearch
                  placeholder="Label..."
                  options={labelList ?? []}
                  onChange={(val) => {
                    setLabels(val);
                    setCurrentPage(0);
                  }}
                  value={labels}
                />
              </TableCell>
              <TableCell>Actions</TableCell>
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
                      href={`${paths.dashboard.article.articleDetails.replace(
                        ":articleId",
                        post?.id
                      )}`}
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
                  <TableCell>
                    <Stack direction='row'>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenEdit(post?.id)} color="primary">
                          <Iconify icon="mage:edit"/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteModalOpen(post?.id)} color="error">
                          <Iconify icon="heroicons:trash"/>
                        </IconButton>
                      </Tooltip>
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
          onUpdate={setCurrentPage}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={count}
          onPageChange={(event, index)=>onPageChange(index)}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Stack>

      {deleteModalOpen && ( 
        <ConfirmDialog
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }} 
          title="Delete Article"
          description="Are you sure want to delete this article? This action cannot be undone."
          confirmAction={handleDeletePost}
          isLoading={isDeleting}
        />
      )}
    </Box>
  );
};

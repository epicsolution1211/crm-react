import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { blogApi } from "src/api/blog";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import Input from "@mui/material/Input";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useParams } from "react-router";
import { BlogListView } from "src/sections/dashboard/blog-public/blog-list-view";
import { PostCard } from "src/sections/dashboard/blog-public/post-card";
import { useDebounce } from "src/hooks/use-debounce";
import { Iconify } from "src/components/iconify";

const usePosts = () => {
  const isMounted = useMounted();
  const params = useParams();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [nextPage, setNextPage] = useState(null);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const query = useDebounce(text, 300);

  const handlePostsGet = useCallback(async () => {
    try {
      const request = {
        company_id: params?.companyId,
        page: currentPage + 1,
        per_page: perPage,
        q: query?.length > 0 ? query : null,
      }
      const res = await blogApi.getArticles(request);

      if (isMounted()) {
        setPosts(res?.questions);
        setCount(res?.total_count);
        setNextPage(res?.next_page);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, params, currentPage, perPage, query]);

  useEffect(() => {
    handlePostsGet();
  }, [currentPage, perPage, params, query]);

  return {
    posts,
    text,
    setText,
    perPage,
    nextPage,
    currentPage,
    count,
    setPerPage,
    setCurrentPage,
  };
};

const Articles = () => {
  // eslint-disable-next-line no-unused-vars
  const [isCardsView, setIsCardsView] = useState(true);

  const {
    posts,
    perPage,
    text,
    setText,
    nextPage,
    count,
    setPerPage,
    setCurrentPage,
    currentPage,
  } = usePosts();

  usePageView();

  return (
    <>
      <Seo title={`Article: Article List`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={1}>
            <Typography variant="h3">Articles</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 10 }}
          >
            <Stack>
              <Typography variant="h4">Recent Articles</Typography>
              <Typography color="text.secondary" sx={{ mt: 2 }} variant="body1">
                Discover the latest news, tips and user research insights.
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ my: 4 }} />
          {isCardsView ? (
            <Stack>
              <OutlinedInput
                startAdornment={
                  <Iconify icon="lucide:search" color="text.secondary" width={24} />
                }
                placeholder="Enter a keyword"
                type="search"
                value={text}
                onChange={(event) => setText(event?.target?.value)}
              />
              <Grid container spacing={4} sx={{ mt: 4 }}>
                {posts?.map((post) => (
                  <Grid key={post?.name} xs={12} md={6}>
                    <PostCard
                      id={post?.id}
                      authorAvatar={post?.account_avatar ?? ""}
                      authorName={post?.account_name ?? "Admin"}
                      labels={post?.article_labels}
                      cover={post?.banner_url}
                      publishedAt={post?.created_at}
                      readTime={"6 min"}
                      shortDescription={post?.short_deacription}
                      title={post?.name}
                      sx={{ height: "100%" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>

          ) : (
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
                    disableUnderline
                    fullWidth
                    value={text}
                    onChange={(event) => {
                      setText(event?.target?.value);
                    }}
                    placeholder="Enter a keyword"
                  />
                </Box>
              </Stack>
              <Divider />
              <BlogListView
                posts={posts}
                count={count}
                onPageChange={(index) => setCurrentPage(index)}
                page={currentPage}
                onRowsPerPageChange={(event) =>
                  setPerPage(event?.target?.value)
                }
                rowsPerPage={perPage}
                setCurrentPage={setCurrentPage}
              />
            </Card>
          )}

          {isCardsView ? (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="center"
              spacing={1}
              sx={{
                mt: 4,
                mb: 8,
              }}
            >
              <Button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                startIcon={<Iconify icon="octicon:arrow-left-16" width={24} />}
              >
                Older posts
              </Button>
              <Button
                disabled={!nextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
              >
                Newer
              </Button>
            </Stack>
          ) : null}
        </Container>
      </Box>
    </>
  );
};

export default Articles;

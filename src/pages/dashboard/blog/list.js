import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Tooltip from "@mui/material/Tooltip";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Iconify } from 'src/components/iconify';
import { blogApi } from "src/api/blog";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import { PostCard } from "src/sections/dashboard/blog/post-card";
import { BlogListView } from "src/sections/dashboard/blog/blog-list-view";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { useRouter } from "src/hooks/use-router";

const usePosts = () => {
  const isMounted = useMounted();
  const { company, user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_article === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [nextPage, setNextPage] = useState(null);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = useDebounce(text, 300);

  const handlePostsGet = useCallback(async () => {
    setIsLoading(true);
    try {
      const request = {
        company_id: company?.id,
        page: currentPage + 1,
        per_page: perPage,
        q: query?.length > 0 ? query : null,
      };
      if (labels?.length) {
        request.label_ids = labels;
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
    setIsLoading(false);
  }, [isMounted, company, currentPage, perPage, query, labels]);

  useEffect(() => {
    if (company) {
      handlePostsGet();
    }
  }, [currentPage, perPage, company, query, labels]);

  return {
    isLoading,
    posts,
    text,
    setText,
    labels,
    setLabels,
    perPage,
    nextPage,
    currentPage,
    count,
    setPerPage,
    setCurrentPage,
    handlePostsGet,
  };
};

const useLabels = () => {
  const { user } = useAuth();

  const [labelList, setLabelList] = useState([]);

  const getLabels = async () => {
    try {
      const res = await blogApi.getArticleLabels({ account_id: user?.id });
      const labelInfo = res?.labels?.map((label) => ({
        label: label?.name,
        value: label?.id + "",
      }));
      setLabelList(labelInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getLabels();
  }, []);

  return { labelList };
};

const Page = () => {
  const {
    isLoading,
    posts,
    perPage,
    text,
    setText,
    nextPage,
    labels,
    setLabels,
    count,
    setPerPage,
    setCurrentPage,
    currentPage,
    handlePostsGet,
  } = usePosts();

  const { user, company } = useAuth();
  const { labelList } = useLabels();

  const [isCardsView, setIsCardsView] = useState(false);

  usePageView();

  if (!company) {
    return null;
  }

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

          <PayWallLayout>
            <Card
              elevation={16}
              sx={{
                alignItems: "center",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                mb: 8,
                mt: 6,
                px: 3,
                py: 2,
              }}
            >
              <Typography variant="subtitle1">
                Hello, {user?.first_name ?? "Admin"}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  component={RouterLink}
                  href={`/public/${company?.id}/articles`}
                  variant="contained"
                >
                  Public Page
                </Button>
                {user?.acc?.acc_e_article === undefined ||
                  user?.acc?.acc_e_article ? (
                  <Button
                    component={RouterLink}
                    href={paths.dashboard.article.articleCreate}
                    variant="contained"
                  >
                    New Article
                  </Button>
                ) : null}
              </Stack>
            </Card>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack>
                <Typography variant="h4">Recent Articles</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                  variant="body1"
                >
                  Discover the latest news, tips and user research insights.
                </Typography>
              </Stack>

              {isCardsView ? (
                <Tooltip title="Switch to List view">
                  <IconButton
                    onClick={() => {
                      setIsCardsView(false);
                      setCurrentPage(0);
                    }}
                    color="primary"
                  >
                    <Iconify icon="fe:list-bullet" width={28}/>
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Switch to Cards view">
                  <IconButton
                    onClick={() => {
                      setIsCardsView(true);
                      setCurrentPage(0);
                    }}
                    color="primary"
                  > 
                    <Iconify icon="streamline:cards" width={28}/>
                  </IconButton>
                </Tooltip>
              )}
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
                <Grid
                  container
                  spacing={4}
                  sx={{ mt: 4, justifyContent: "center" }}
                >
                  {!isLoading ? (
                    posts.map((post) => (
                      <Grid key={post?._id} xs={12} md={6}>
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
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        mt: 10,
                      }}
                    >
                      <CircularProgress
                        size={70}
                        sx={{ alignSelf: "center", justifySelf: "center" }}
                      />
                    </Box>
                  )}
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
                  {isLoading && (
                    <Iconify
                      icon='svg-spinners:8-dots-rotate'
                      width={24}
                      sx={{ color: 'white' }}
                    />
                  )}
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
                  onPostsGet={handlePostsGet}
                  setCurrentPage={setCurrentPage}
                  setLabels={setLabels}
                  labels={labels}
                  labelList={labelList}
                />
              </Card>
            )}

            {isCardsView && !isLoading ? (
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
                  startIcon={
                    <Iconify icon="octicon:arrow-left-16" width={24} />
                  }
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
          </PayWallLayout>
        </Container>
      </Box>
    </>
  );
};

export default Page;

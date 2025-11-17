import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { LandingBlogListView } from "src/sections/landing/article/blog-list-view";
import { LandingPostCard } from "src/sections/landing/article/landing-article-card";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { articleMockedList } from "src/utils/constant/mock-data";
import { usePageView } from "src/hooks/use-page-view";

const Page = () => {
  const [isCardsView, setIsCardsView] = useState(true);

  usePageView();

  return (
    <>
      <Seo title="Article" />
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
                Hello, Welcome
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="contained"
                >
                  Public Page
                </Button>
                <Button
                  variant="contained"
                >
                  New Article
                </Button>
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
                    }}
                  >
                    <Iconify icon="fe:list-bullet" width={28}/>
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Switch to Cards view">
                  <IconButton
                    onClick={() => {
                      setIsCardsView(true);
                    }}
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
                />
                <Grid container spacing={4} sx={{ mt: 4 }}>
                  {articleMockedList.map((post) => (
                    <Grid
                      key={post.title}
                      xs={12}
                      md={6}
                    >
                      <LandingPostCard
                        authorAvatar={post.author.avatar}
                        authorName={post.author.name}
                        category={post.category}
                        cover={post.cover}
                        publishedAt={post.publishedAt}
                        readTime={post.readTime}
                        shortDescription={post.shortDescription}
                        title={post.title}
                        sx={{ height: '100%' }}
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
                      placeholder="Enter a keyword"
                    />
                  </Box>
                </Stack>
                <Divider />
                <LandingBlogListView />
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
                }}
              >
                <Button
                  startIcon={<Iconify icon="octicon:arrow-left-16" width={24} />}
                >
                  Older posts
                </Button>
                <Button
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

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { blogApi } from "src/api/blog";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const usePost = () => {
  const isMounted = useMounted();
  const params = useParams();

  const [post, setPost] = useState(null);

  const handlePostGet = useCallback(async () => {
    try {
      const response = await blogApi.getArticle(
        params?.articleId,
        params?.companyId
      );

      if (isMounted()) {
        setPost(response?.question?.question);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, params]);

  useEffect(() => {
    handlePostGet();
  }, [params]);

  return post;
};

const Article = () => {
  const post = usePost();
  const params = useParams();

  usePageView();

  if (!post) {
    return null;
  }

  const publishedAt = format(new Date(post?.created_at), "MMMM d, yyyy");

  return (
    <>
      <Seo title={`Article: Article Details`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xl">
          <Link
            color="text.primary"
            component={RouterLink}
            href={`/public/${params?.companyId}/articles`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
            <Typography variant="subtitle1">To articles list</Typography>
          </Link>
          <Stack spacing={1} sx={{ mt: 4 }}>
            <Typography variant="h3">Article</Typography>
          </Stack>
          <Stack spacing={3} sx={{ mt: 10 }}>
            <div>
              <Stack direction="row" alignItems="center" spacing={1}>
                {post?.article_labels?.map((label) => (
                  <Chip
                    label={label?.name}
                    sx={{ background: label?.color }}
                    key={label?.id}
                  />
                ))}
              </Stack>
            </div>
            <Typography variant="h3">{post?.name}</Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {post?.short_deacription}
            </Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Avatar
                src={post?.account_avatar ? post?.account_avatar?.includes('http') ? post?.account_avatar : `${getAPIUrl()}/${post?.account_avatar}` : ""}
              />
              <div>
                <Typography variant="subtitle2">
                  By {post?.account_name} • {publishedAt}
                </Typography>
              </div>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundImage: `url(${post?.banner_url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: 1,
              height: 380,
              mt: 3,
            }}
          />
          {post.description && (
            <Stack sx={{ py: 3, width: 1 }}>
              <div dangerouslySetInnerHTML={{ __html: post.description }} />
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Article;

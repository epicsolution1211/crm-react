import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { DeleteModal } from "src/components/customize/delete-modal";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { blogApi } from "src/api/blog";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

const usePost = () => {
  const isMounted = useMounted();
  const params = useParams();
  const { company, user } = useAuth();

  const [post, setPost] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_article === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const handlePostGet = useCallback(async () => {
    try {
      const response = await blogApi.getArticle(params?.articleId, company?.id);

      if (isMounted()) {
        setPost(response?.question?.question);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, company]);

  useEffect(() => {
    handlePostGet();
  }, [company]);

  return post;
};

const Page = () => {
  const post = usePost();
  const { user } = useAuth();
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  usePageView();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleArticleDelete = useCallback(async () => {
    try {
      await blogApi.deleteArticle(post?.id);
      toast.success("Article successfully deleted!");
      router.push(paths.dashboard.article.index);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [post]);

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
            href={paths.dashboard.article.index}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
            <Typography variant="subtitle1">To articles list</Typography>
          </Link>
          <Stack spacing={1} sx={{ mt: 3 }}>
            <Typography variant="h3">Article</Typography>
          </Stack>
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
              position: "sticky",
              top: scrolled ? 64 : 0,
              zIndex: 1100,
              backgroundColor: "background.paper",
              transition: 'top 0.3s ease',
              boxShadow: scrolled ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            <Typography variant="subtitle1">
              Hello, {user?.first_name ?? "Admin"}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.article.articleEdit.replace(
                  ":articleId",
                  post?.id
                )}
                variant="contained"
              >
                Edit Post
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Post
              </Button>
            </Stack>
          </Card>
          <Stack spacing={3}>
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
              backgroundImage: post?.banner_url ? `url("${getAPIUrl()}/${post?.banner_url}")` : "",
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: 1,
              height: 380,
              mt: 3,
            }}
          />
          {post.description && (
            <div dangerouslySetInnerHTML={{ __html: post.description }} />
          )}
        </Container>
      </Box>

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        title="Are you sure you want to delete this article?"
        description=""
        onDelete={handleArticleDelete}
      />
    </>
  );
};

export default Page;

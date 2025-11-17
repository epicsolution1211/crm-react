import Grid from "@mui/material/Grid";
import { PostCard } from "./post-card";

export const BlogCardsView = (props) => {
  const { posts } = props;

  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid key={post.title} xs={12} md={6}>
          <PostCard
            authorAvatar={post.author.avatar}
            authorName={post.author.name}
            category={post.category}
            cover={post.cover}
            publishedAt={post.publishedAt}
            readTime={post.readTime}
            shortDescription={post.shortDescription}
            title={post.title}
            sx={{ height: "100%" }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

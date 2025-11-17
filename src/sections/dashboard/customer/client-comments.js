import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

export const ClientComments = (props) => {
  if (!props?.comments?.length) {
    return <Stack>There are no comments yet.</Stack>;
  }

  const reversedComments = [...(props.comments || [])].reverse();

  return (
    <Stack spacing={1}>
      {reversedComments.map((comment) => (
        <Stack
          key={comment?.id}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <Typography variant={"subtitle2"} sx={{ fontSize: 11 }}>
            {format(new Date(comment?.created_at), "dd MMM yyyy HH:mm")}
          </Typography>
          <Typography variant={"subtitle2"} sx={{ fontSize: 11 }}>
            {comment?.account_id ? comment.account_name : "System"}:{" "}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: comment?.comment?.replace(/\n/g, "<br>") }} />
        </Stack>
      ))}
    </Stack>
  );
};

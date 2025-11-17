import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import {QuillEditor} from "../../quill-editor";

export const SettingsMiniChatTerms = (props) => {
  const { terms, setTerms, enabled, handleEnabledChange, handleUpdateTerms } = props

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Set terms and conditions</Typography>
          <Stack
            spacing={3}
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Stack spacing={1}>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Terms & Conditions status
              </Typography>
            </Stack>
            <Switch
              checked={enabled}
              color="primary"
              edge="start"
              name="welcome_message"
              onChange={handleEnabledChange}
              value={enabled}
            />
          </Stack>
          <Stack
            spacing={2}
            alignItems="center"
            direction="row"
            sx={{ mt: 3 }}
          >
            <QuillEditor
              onChange={setTerms}
              placeholder="Write your terms & conditions..."
              sx={{ height: 300, width: "100%" }}
              value={terms}
            />
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdateTerms}
              disabled={!enabled}
            >
              Save
            </Button>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatTerms.propTypes = {
  terms: PropTypes.string,
  setTerms: PropTypes.func,
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.func,
  handleUpdateTerms: PropTypes.func,
}

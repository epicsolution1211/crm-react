import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { QuillEditor } from "src/components/quill-editor";

export const ChatEmailInput = (props) => {
  const {
    disabled,
    value,
    subject,
    setValue,
    setSubject,
    senderEmail,
    senderEmails,
    setSenderEmail,
    isHtml,
  } = props;

  return (
    <Stack spacing={1} alignItems="center" sx={{ width: 1, maxWidth: "90%" }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="sender-email-label">Sender email</InputLabel>
        <Select
          id="sender-email"
          labelId="sender-email-label"
          value={senderEmail}
          onChange={(event) => setSenderEmail(event?.target?.value)}
          sx={{ width: 1 }}
          label="Sender email"
          size="small"
        >
          {senderEmails?.map((email) => (
            <MenuItem key={email?.email} value={email?.email}>
              {email?.email}
              <Chip
                size="small"
                variant="outlined"
                label={`${email?.type}`}
                sx={{ cursor: "pointer", ml: 1, fontSize: 11, color: 'text.secondary' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <OutlinedInput
        disabled={disabled}
        fullWidth
        onChange={(e) => setSubject(e?.target?.value)}
        placeholder="Write a subject"
        size="small"
        value={subject}
      />

      {isHtml ? (
        <Box
          sx={{
            width: 1,
            height: 200,
            border: "solid 2px",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body {
                      margin: 0;
                      padding: 16px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      color: #333;
                      background: white;
                    }
                    * {
                      box-sizing: border-box;
                    }
                    p {
                      margin: 0 0 8px 0;
                    }
                    ul, ol {
                      margin: 0 0 8px 0;
                      padding-left: 20px;
                    }
                    li {
                      margin: 0 0 4px 0;
                    }
                    h1, h2, h3, h4, h5, h6 {
                      margin: 0 0 12px 0;
                      font-weight: 600;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 0 0 8px 0;
                    }
                    th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: left;
                    }
                    th {
                      background-color: #f5f5f5;
                      font-weight: 600;
                    }
                    img {
                      max-width: 100%;
                      height: auto;
                    }
                  </style>
                </head>
                <body>${value || ""}</body>
              </html>
            `}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
            }}
            title="Email content preview"
          />
        </Box>
      ) : (
        <QuillEditor
          placeholder="Write an email"
          sx={{ height: 200, width: 1 }}
          value={value}
          onChange={setValue}
        />
      )}
    </Stack>
  );
};

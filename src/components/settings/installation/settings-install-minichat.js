
import { useState, useEffect } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { settingsApi } from 'src/api/settings';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { codeStyle } from 'src/utils/code-style';

const Code = (props) => {
  const { inline, className, children, ...other } = props;

  const language = /language-(\w+)/.exec(className || '');

  return !inline && language
    ? (
      <SyntaxHighlighter
        children={String(children).replace(/\n$/, '')}
        language={language[1]}
        PreTag="div"
        style={codeStyle}
        {...other} />
    )
    : (
      <code
        className={className}
        {...other}>
        {children}
      </code>
    );
};

export const SettingInstallMiniChat = () => {
  const [miniChatData, setMiniChatData] = useState();
  const [codeData, setCodeData] = useState("");

  const miniChatInfo = async () => {
    try {
      const res = await settingsApi.getMiniChatAppearance();
      setMiniChatData(res);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const host = window.location.host;
  const token = miniChatData?.company?.token;
  const script =
    `<iframe id="octolit_minichat_init" style="height: 100%; width: 100%; border-width: 0px;"
      src="https://${host}/miniChat?token=${token}&full_screen=false&origin=octolit
            &full_name=Client&paletteMode=dark&colorPreset=indigo">
  </iframe>

  // paletteMode: dark | white
  // colorPreset: green | blue | indigo | purple 
`;

  useEffect(() => {
    miniChatInfo();
  }, []);

  useEffect(() => {
    const data = `
  \`\`\`ts
  ${script}
  \`\`\`
  `;
    setCodeData(data);

  }, [miniChatData]);

  return (
    <Stack
      spacing={3}
    >
      <Stack
        spacing={4}
        sx={{ p: 2 }}
      >
        <Typography
          variant="h6"
        >Installation using HTML code</Typography>
        <Typography>Copy the below frame code and place it on your website. Your Mini Chat will be loaded automatically. </Typography>
        <Stack
          direction="row"
          gap={2}
          alignItems="center">
          <Markdown
            children={codeData}
            components={{ code: Code }}></Markdown>
          <IconButton
            edge="end"
            onClick={() => copyToClipboard(script)}
          >
            <ContentCopyIcon
              color="success"
              fontSize="small" />
          </IconButton>
        </Stack>
        <Stack
          sx={{ mt: 3 }}
          spacing={3}>
          <Stack
            spacing={1}>
            <Typography
              gutterBottom
              variant="h6"
            >
              Advance Options
            </Typography>
          </Stack>
          <Typography>In order to identify your customers for your support team you can add below parameters in your iframe link: </Typography>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography
              variant="h6">Custom email:</Typography>
            <Typography>Email of your customer</Typography>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            alignItems="center">
            <Typography
              variant="h6">Pincode:</Typography>
            <Typography>Unique pin code for your customer to approve their account</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
};

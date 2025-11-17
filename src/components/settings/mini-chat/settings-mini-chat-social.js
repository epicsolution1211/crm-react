import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {useCallback} from "react";
import Button from "@mui/material/Button";

const SOCIALS_TO_TITLES = {
  calendar_url: "Calendar",
  messenger_url: "Messenger",
  skype_url: "Skype",
  telegram_url: "Telegram",
  viber_url: "Viber",
  whatsapp_url: "WhatsApp",
}

const SOCIALS_TO_LOGO = {
  calendar_url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
  messenger_url: "/assets/socials/messenger.svg",
  skype_url: "/assets/socials/skype.svg",
  telegram_url: "/assets/socials/telegram.svg",
  viber_url: "/assets/socials/viber.svg",
  whatsapp_url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
}

export const SettingsMiniChatSocial = (props) => {
  const { socials, setSocials, handleUpdateSocial } = props;

  const handleChangeSocial = useCallback((name, e) => {
    setSocials(() => ({ ...socials, [name]: e.target.value }));
  }, [setSocials, socials]);

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Urls for the social networks</Typography>
        {
          Object.entries(socials).map(([ key, value ]) => (
            <Stack
              spacing={6}
              alignItems="center"
              direction="row"
            >
              <img src={SOCIALS_TO_LOGO[key]} alt="logo" style={{ height: 30 }} />
              {/*<Typography>{SOCIALS_TO_TITLES[key]}</Typography>*/}
              <TextField
                sx={{ flexGrow: 1 }}
                label={`Write ${ SOCIALS_TO_TITLES[key] } url`}
                value={value || ""}
                onChange={(e) => handleChangeSocial(key, e)}
              />
              <Button
                color="inherit"
                size="small"
                onClick={() => handleUpdateSocial(key)}
              >
                Save
              </Button>
            </Stack>
          ))
        }
      </Stack>
    </Stack>
  )
};

SettingsMiniChatSocial.propTypes = {
  socials: PropTypes.string,
  handleUpdateSocial: PropTypes.func,
}

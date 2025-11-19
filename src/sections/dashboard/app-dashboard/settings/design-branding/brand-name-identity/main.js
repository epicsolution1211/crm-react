import { Box } from "@mui/material";
import {HeaderBrandNameIdentity} from "./header"
import {UploadLogo} from "./upload-logo"
import { AppNameAndLanguage } from "./app-name-and-language"

export function MainBrandNameIdentity () {
    return(
        <Box>
            <HeaderBrandNameIdentity />
            <Box sx={{px:3 , py:3}}>
                <UploadLogo />
            </Box>
            <Box>
                <AppNameAndLanguage />
            </Box>
        </Box>
    )
}
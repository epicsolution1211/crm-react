import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";

export const EmailTemplateList = ({emailTemplateList ,setAddBtn, selectedEmailTemplateId , setSelectedEmailTemplateId, setIsOpenEditModal,setIsOpenDeleteModal  }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);
  
  return (
    <>
      <Scrollbar sx={{ height: {md: "calc(100vh - 470px)", xs: 'auto'}, pr: 1.5 }}>
        <Stack direction='column' gap={1} >
          {emailTemplateList?.map((item) => (
            <Paper 
              sx={{ 
                ...cssVars,
                cursor: 'pointer !important',
                backgroundColor: settings.paletteMode == "dark" ?"var(--nav-bg)": 'background.default',
                py: 1.5, px: 2,
                boxShadow: 8,
                border: 1,
                borderColor: selectedEmailTemplateId == item.id ? 'primary.main' : (settings.paletteMode == "dark" ?'background.default':'text.disabled'),
                minHeight: 68,
                '&:hover': {
                  cursor:'Point',
                  '& .hide': {
                    opacity: 1,
                    transition: 'opacity 0.2s ease, height 0.2s ease',
                  },
                },
              }}
            >
              <Stack alignItems='center' direction="row" justifyContent='space-between'
                onClick={() => { setSelectedEmailTemplateId(item?.id) }}
                key={item?.id}
              >
                <Typography>{item?.name}</Typography>
                <Stack direction="row">
                  <Tooltip
                    placement="bottom"
                    title="Edit">
                    <Box 
                      className="hide" 
                      sx={{ 
                        opacity: 0,
                        transition: 'opacity 0.2s ease, height 0.2s ease'
                      }}>
                      <IconButton
                        // eslint-disable-next-line no-unused-vars
                        onClick={(e) => { 
                          setIsOpenEditModal(true);
                          setAddBtn(false);
                          setSelectedEmailTemplateId(item?.id)
                          }}
                        //e.stopPropagation(); setSelectedEditForm(item)
                        sx={{ color: "primary.main" }}
                      >
                        <Iconify icon="mage:edit" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  <Tooltip
                    placement="bottom"
                    title="Delete">
                    <Box 
                      className="hide" 
                      sx={{  
                        opacity: 0,
                        transition: 'opacity 0.2s ease, height 0.2s ease'
                      }}>
                      <IconButton
                        // eslint-disable-next-line no-unused-vars
                        onClick={(e) => { 
                          setIsOpenDeleteModal(true)
                          setSelectedEmailTemplateId(item?.id)
                        }}
                        //e.stopPropagation(); handleDeleteForm(item?.id)
                        sx={{ color: "error.main" }}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Stack>
              </Stack>
              </Paper>
          ))}
        </Stack>
      </Scrollbar>
      
    </>
  );
};

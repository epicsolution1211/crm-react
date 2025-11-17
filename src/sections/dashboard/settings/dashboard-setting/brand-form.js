import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { formsApi } from "src/api/forms";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";
import { isValidJSON } from "src/utils/function";
import { useTranslation } from "react-i18next";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export const BrandForm = ({ brandId, brand, getBrands }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const [formList, setFormList] = useState([]);

  const [currentTab, setCurrentTab]= useState('choices');

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const addBrandForm = async (id) => {
    try {
      await formsApi.createBrandForm({internal_brand_id: brandId.toString(), brand_form_id: id.toString()});
      toast.success("Form successfully added to Brand!");
    } catch (error){
      toast.error("Something went wrong!");
    }
    getBrands();
  }

  const removeBrandForm = async (id) => {
    try {
      await formsApi.deleteBrandForm({internal_brand_id: brandId.toString(), brand_form_id: id.toString()})
      toast.success("Form successfully removed from Brand!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
    getBrands();
  }

  const [checked, setChecked] = useState([])
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const getFormList = async () => {
    const response = await formsApi.getForms();
    setFormList(response.forms);
  }
  const getBrandFormList = async () => {
    await formsApi.getBrandForm();
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) =>
    intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = async () => {
    leftChecked?.map(item => {
      addBrandForm(item.id);
    })
  };

  const handleCheckedLeft = () => {
    rightChecked?.map(item => {
      removeBrandForm(item.id);
    })
  };

  const customList = (title, items, toRight, toLeft, rightChecked, leftChecked) => {
    const settings = useSettings();
    const cssVars = useCssVars(settings.navColor);

    return (
      <Card
        sx={{
          ...cssVars,
          backgroundColor: settings.paletteMode == "dark" ?"var(--nav-bg)": 'background.default',
          border: 1,
          borderColor: 'text.disabled',
        }}
      >
        <Stack direction='column' gap={1} sx={{ pt: { md: 3, xs: 1}, pb: 1, px: { md: 2, xs: 0 }}}>
          <Typography variant="h5" px={2} textAlign='center' sx={{ display: { md: 'block', xs: 'none' }}}>{title}</Typography> 
          <Stack direction='row' alignItems='center' justifyContent='space-between' px={1}>
            <Stack 
              alignItems='center'
              direction='row'
              sx={{ gap: { md: 1.5, xs: 0.5 }}}
            >
              <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                disabled={items.length === 0}
                inputProps={{
                  'aria-label': 'all items selected',
                }} />
              <Typography>
              {`${numberOfChecked(items)}/${items.length} selected`}
              </Typography>
            </Stack>
            {title == 'Choices'?
              <Button
                sx={{ display: { md: 'none', xs: 'flex' } }}
                disabled={leftChecked?.length==0} 
                endIcon={<Iconify icon="mi:arrow-right" />}
                onClick={()=> toRight()}
              > 
                To Fields
              </Button>:
              <Button
                sx={{ display: { md: 'none', xs: 'flex' } }}
                disabled={rightChecked?.length==0} 
                startIcon={<Iconify icon="mi:arrow-left" />}
                onClick={()=> toLeft()}
              > 
                To Choices
              </Button>
            }
          </Stack> 
        </Stack>
        <Divider />
        <Stack sx={{ minHeight: "calc(100vh - 500px)" }}>
          <Grid container columnSpacing={1} py={0.5} sx={{ px: { md: 3, xs: 1 }, pb: { md: 0.5, xs: 3 }}}>
            {items.map((value) => {
              const labelId = `transfer-list-all-item-${value}-label`;
              let formNameInfo = {};
  
              if (isValidJSON(value?.name)) {
                const parsedForm = JSON.parse(value?.name);
                formNameInfo = {...parsedForm};
              } else {
                formNameInfo.en = value?.name;
              }
  
              return (
                <Grid 
                  lg={6} 
                  xs={12}
                >
                  <ListItemButton
                    key={value.id}
                    role="listitem"
                    sx={{ borderRadius: 1, p: 0 }}
                    onClick={handleToggle(value)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          'aria-labelledby': labelId,
                        }} />
                    </ListItemIcon>
                    <ListItemText sx={{ whiteSpace: 'nowrap' }} id={labelId} primary={formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] :  formNameInfo?.en ?? ""} />
                  </ListItemButton>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Card>
    );
  };

  useEffect(() => {
    getFormList();
    getBrandFormList();
  }, [])

  useEffect(() => {
    setLeft(formList?.filter(item => brand.required_forms?.findIndex(form => form.id == item.id) == -1))
    setRight(formList?.filter(item => brand.required_forms?.findIndex(form => form.id == item.id) !== -1))
  }, [formList, brand]);

  return (
    <>
      <Stack sx={{ display: { md: 'block', xs: 'none' }}}>
        <Grid
          container
          spacing={2}
          sx={{ 
            width: 1, 
            p: { md: 3, xs: 0 }, 
            pl: { md: 6, xs: 0 }, 
            pt: { md: 3, xs: 2},
          }}
        >
          <Grid md={5.3} xs={6}>{customList('Choices', left)}</Grid>
          <Grid md={1.4} xs={1.4} sx={{ minHeight: "calc(100vh - 400px)" }}>
            <Stack container direction="column" sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <Iconify icon="solar:arrow-right-linear" />
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <Iconify icon="solar:arrow-left-linear" />
              </Button>
            </Stack>
          </Grid>
          <Grid md={5.3} xs={6}>{customList('Added Forms', right)}</Grid>
        </Grid>
      </Stack>
      <Stack sx={{ display: { md: 'none', xs: 'block' }}}>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
          sx={{ width: 1 }}
        >
          <Tab
            label='Choices'
            value='choices'
            sx={{ width: '46%' }}
          />
          <Tab
            label='Required Fields'
            value='add_fields'
            sx={{ width: '46%' }}
          />
        </Tabs>
        <Stack pt={2}>
          {currentTab==='choices'?
            customList('Choices', left, handleCheckedRight, handleCheckedLeft, rightChecked, leftChecked ):
            customList('Added Forms', right, handleCheckedRight, handleCheckedLeft, rightChecked, leftChecked)
          }
        </Stack>
      </Stack>
    </>
  );
};

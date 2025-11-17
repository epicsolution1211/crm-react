import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { roleTemplateDefault } from "./constants";
import { customerFieldsApi } from "src/api/customer-fields";

export const RoleCreate = () => {
  const [roleTemplate, setRoleTemplate] = useState([]);

  const getCustomFieldsAndSetRoleTemplate = async () => {
    try {
      const { client_fields: clientFields } =
        await customerFieldsApi.getCustomerFields();
      if (clientFields?.length) {
        const clientFieldsTemplate = clientFields?.map((field) => ({
          name: `Data ${field?.friendly_name}`,
          edit: {
            param: `acc_custom_e_${field?.value}`,
            value: true,
          },
          view: {
            param: `acc_custom_v_${field?.value}`,
            value: true,
          },
        }));
        roleTemplateDefault
          ?.find((t) => t?.name === "Customers")
          ?.items?.push(...clientFieldsTemplate);
        setRoleTemplate(roleTemplateDefault);
      } else {
        setRoleTemplate(roleTemplateDefault);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCustomFieldsAndSetRoleTemplate();
  }, []);

  const handleChangeTemplateValue = (e, name, type) => {
    const val = e?.target?.checked;
    const updatedRoleTemplates = roleTemplate?.map((template) => {
      if (template?.name === name) {
        return {
          ...template,
          [type]: {
            ...template[type],
            value: val,
          },
        };
      } else {
        return template;
      }
    });
    setRoleTemplate(updatedRoleTemplates);
  };

  const handleChangeChildTemplateValue = (e, name, childName, type) => {
    const val = e?.target?.checked;
    const updatedRoleTemplates = roleTemplate?.map((template) => {
      if (template?.name === name) {
        return {
          ...template,
          items: template?.items?.map((item) => {
            if (item?.name === childName) {
              return {
                ...item,
                [type]: {
                  ...item[type],
                  value: val
                },
              };
            } else {
              return item;
            }
          }),
        };
      } else {
        return template;
      }
    });
    setRoleTemplate(updatedRoleTemplates);
  };

  const handleCreateTemplate = async () => {
    try {
      const flattenedArray = [];

      roleTemplate?.forEach((obj) => {
        flattenedArray.push({ ...obj, items: undefined }); // Include the original item without 'items'
        if (obj.items) {
          flattenedArray.push(...obj.items); // Include the 'items' if they exist
        }
      });

      const paramsArray = flattenedArray?.map(item => {
        return { ...item?.view, ...item?.edit }
      });

      const params = {};

      paramsArray?.forEach(item => {
        params[item?.param] = item?.value;
      });

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Role Template Create</Typography>
            <Button variant="contained" onClick={handleCreateTemplate}>
              Create template
            </Button>
          </Stack>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Stack divider={<Divider />} spacing={3} sx={{ mt: 3 }}>
          {roleTemplate?.map((template, index) => {
            const childItems = template?.items;
            return (
              <Stack spacing={2} key={template?.name + index}>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography gutterBottom variant="subtitle1">
                      {template?.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {template?.description}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    {template?.view ? (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton disabled>
                          <Iconify icon="fluent:eye-32-filled" width={30}/>
                        </IconButton>

                        <Switch
                          checked={template?.view?.value}
                          color="primary"
                          edge="start"
                          name="isVerified"
                          value={template?.view?.value}
                          onChange={(e) =>
                            handleChangeTemplateValue(e, template?.name, "view")
                          }
                        />
                      </Stack>
                    ) : null}

                    {template?.edit ? (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton disabled>
                          <Iconify icon="grommet-icons:edit" width={28}/>
                        </IconButton>

                        <Switch
                          checked={template?.edit?.value}
                          color="primary"
                          edge="start"
                          name="isVerified"
                          value={template?.edit?.value}
                          onChange={(e) =>
                            handleChangeTemplateValue(e, template?.name, "edit")
                          }
                        />
                      </Stack>
                    ) : null}
                  </Stack>
                </Stack>

                {childItems && childItems?.length ? (
                  <Stack
                    divider={<Divider />}
                    spacing={3}
                    sx={{ pt: 4, pl: 4 }}
                  >
                    {childItems?.map((childTemplate, index) => (
                      <Stack
                        key={childTemplate?.name + index}
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Stack spacing={1}>
                          <Typography gutterBottom variant="subtitle1">
                            {childTemplate?.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          {childTemplate?.view ? (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <IconButton disabled>
                                <Iconify icon="fluent:eye-32-filled" width={30}/>
                              </IconButton>

                              <Switch
                                checked={childTemplate?.view?.value}
                                color="primary"
                                edge="start"
                                name="isVerified"
                                value={childTemplate?.view?.value}
                                onChange={(e) =>
                                  handleChangeChildTemplateValue(
                                    e,
                                    template?.name,
                                    childTemplate?.name,
                                    "view"
                                  )
                                }
                              />
                            </Stack>
                          ) : null}

                          {childTemplate?.edit ? (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <IconButton disabled>
                                <Iconify icon="grommet-icons:edit" width={28}/>
                              </IconButton>

                              <Switch
                                checked={childTemplate?.edit?.value}
                                color="primary"
                                edge="start"
                                name="isVerified"
                                value={childTemplate?.edit?.value}
                                onChange={(e) =>
                                  handleChangeChildTemplateValue(
                                    e,
                                    template?.name,
                                    childTemplate?.name,
                                    "edit"
                                  )
                                }
                              />
                            </Stack>
                          ) : null}
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

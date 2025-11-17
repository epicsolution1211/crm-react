import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { FileDropzone } from "src/components/file-dropzone";
import { QuillEditor } from "src/components/quill-editor";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import { fileToBase64 } from "src/utils/file-to-base64";
import { useAuth } from "src/hooks/use-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";
import { blogApi } from "src/api/blog";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ArticleLabelsDialog } from "src/components/article-labels-dialog";
import { settingsApi } from "src/api/settings";
import { ChipSet } from "src/components/customize/chipset";
import { useRouter } from "src/hooks/use-router";
import { toast } from "react-hot-toast";
import { generateGradientImage } from "src/utils/generate-gradient";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  title: yup.string().required("Title is required field"),
  content: yup.string().required("Content is required field"),
  seo_title: yup.string(),
  seo_description: yup.string(),
});

const useLabels = () => {
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_article === false) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [labels, setLabels] = useState([]);
  const [labelList, setLabelList] = useState([]);

  const getLabels = async () => {
    try {
      const res = await blogApi.getArticleLabels({ account_id: user?.id });
      setLabels(res?.labels);
      const labelInfo = res?.labels?.map((label) => ({
        label: label?.name,
        value: label?.id,
      }));
      setLabelList(labelInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getLabels();
  }, []);

  return { labels, labelList, getLabels };
};

const useTeams = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeams = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  return teamList;
};

const Page = () => {
  const { user } = useAuth();
  const { labels, labelList, getLabels } = useLabels();
  const teams = useTeams();
  const router = useRouter();
  const {
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [cover, setCover] = useState(null);
  const [banner, setBanner] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const selectedLabels = useWatch({ control, name: "label_ids" });

  const currentChip = useMemo(() => {
    const newChips = selectedLabels?.map((selected) => {
      const chip = labelList?.find((item) => selected === item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Label",
      };
    });
    if (!selectedLabels) {
      setValue("label_ids", []);
    }
    return newChips;
  }, [selectedLabels, labelList]);

  const handleRemoveChip = (value) => {
    const newStatus = [...selectedLabels].filter((item) => item !== value);
    setValue("label_ids", newStatus);
  };

  usePageView();

  const handleCoverDrop = useCallback(async ([file]) => {
    const data = await fileToBase64(file);
    setCover(data);
    setBanner(file);
  }, []);

  const handleCoverRemove = useCallback(() => {
    setCover(null);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", data.title);
    formData.append("description", data.content);
    formData.append("ai_enabled", aiEnabled);
    if (data.seo_title) formData.append("seo_title", data.seo_title);
    if (data.seo_description)
      formData.append("seo_description", data.seo_description);
    if (data?.label_ids?.length) {
      data.label_ids.forEach((label) => formData.append("labels[]", label));
    }

    const createArticleWithRetry = async (
      formDataToSend,
      maxRetries = 3,
      delay = 2000
    ) => {
      let retries = 0;
      let success = false;
      let response = null;

      while (!success && retries < maxRetries) {
        try {
          response = await blogApi.createArticle(formDataToSend);

          // Check if response is valid
          if (response && response.question && response.question.id) {
            success = true;
          } else {
            throw new Error("Invalid response received");
          }
        } catch (error) {
          retries++;
          console.error(`Article creation attempt ${retries} failed:`, error);

          if (retries >= maxRetries) {
            toast.error(
              "Failed to create article after multiple attempts. Please try again."
            );
            setIsLoading(false);
            return null;
          }

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, delay));
          // Increase delay for next retry (exponential backoff)
          delay = delay * 1.5;
        }
      }

      return response;
    };

    if (banner) {
      formData.append("banner", banner);
      const response = await createArticleWithRetry(formData);

      if (response) {
        setIsLoading(false);
        toast.success("Article successfully created!");
        router.push(
          paths.dashboard.article.articleDetails.replace(
            ":articleId",
            response?.question?.id
          )
        );
      }
    } else {
      try {
        const blob = await generateGradientImage(900, 300);
        formData.append("banner", blob);

        const response = await createArticleWithRetry(formData);

        if (response) {
          toast.success("Article successfully created!");
          setIsLoading(false);
          router.push(
            paths.dashboard.article.articleDetails.replace(
              ":articleId",
              response?.question?.id
            )
          );
        }
      } catch (error) {
        console.error("Failed to generate gradient image:", error);
        toast.error("Failed to create article. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Seo title={`Article: Article Create`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container maxWidth="xl">
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.article.index}
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
              underline="hover"
            >
              <Iconify icon="mi:arrow-left" width={24} mr={1}/>
              <Typography variant="subtitle1">To articles list</Typography>
            </Link>
            <Stack spacing={1} mt={3}>
              <Typography variant="h3">Create a new article</Typography>
            </Stack>
            <Card
              elevation={16}
              sx={{
                alignItems: "center",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                mb: 8,
                mt: 6,
                px: 3,
                py: 2,
                position: "sticky",
                top: scrolled ? 64 : 0,
                zIndex: 1100,
                backgroundColor: "background.paper",
                transition: "top 0.3s ease",
                boxShadow: scrolled
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
              }}
            >
              <Typography variant="subtitle1">
                Hello, {user?.first_name ?? "Admin"}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  href={paths.dashboard.article.index}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading || !isValid}
                  type="submit"
                  variant="contained"
                >
                  Publish changes
                </Button>
                {/* <IconButton>
                  <SvgIcon>
                    <DotsHorizontalIcon />
                  </SvgIcon>
                </IconButton> */}
              </Stack>
            </Card>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                      <Typography variant="h6">Basic details</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                      <Stack spacing={3}>
                        <Stack spacing={1}>
                          <Typography>Post title</Typography>
                          <OutlinedInput
                            fullWidth
                            name="title"
                            placeholder="Type an article title"
                            error={!!errors?.title?.message}
                            helperText={errors?.title?.message}
                            {...register("title")}
                          />
                        </Stack>
                        <MultiSelectMenu
                          control={control}
                          label="Select Labels"
                          name="label_ids"
                          isLabel
                          openModal={() => setOpenLabelModal(true)}
                          list={labelList}
                        />
                        {currentChip?.length > 0 && (
                          <Stack
                            alignItems="center"
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                            sx={{ px: 3, mt: 2 }}
                          >
                            <ChipSet
                              chips={currentChip}
                              handleRemoveChip={handleRemoveChip}
                            />
                          </Stack>
                        )}
                        <Stack
                          spacing={1}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography>AI Access</Typography>
                          <Switch
                            value={aiEnabled}
                            onChange={() => setAiEnabled(!aiEnabled)}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                      <Typography variant="h6">Post cover</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                      <Stack spacing={3}>
                        <FileDropzone
                          accept={{ "image/*": [] }}
                          maxFiles={1}
                          onDrop={handleCoverDrop}
                          caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                        />
                        <div>
                          <Button
                            color="inherit"
                            disabled={!cover}
                            onClick={handleCoverRemove}
                          >
                            Remove photo
                          </Button>
                        </div>
                        {cover ? (
                          <Box
                            sx={{
                              backgroundImage: `url(${cover})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: 1,
                              height: 230,
                              mt: 3,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              border: 1,
                              borderRadius: 1,
                              borderStyle: "dashed",
                              borderColor: "divider",
                              height: 230,
                              mt: 3,
                              p: 3,
                            }}
                          >
                            <Typography
                              align="center"
                              color="text.secondary"
                              variant="h6"
                            >
                              Select a cover image
                            </Typography>
                            <Typography
                              align="center"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                              variant="subtitle1"
                            >
                              Image used for the blog post cover and also for
                              Open Graph meta
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                      <Typography variant="h6">Content</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                      <Controller
                        name="content"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Stack spacing={1}>
                            <QuillEditor
                              placeholder="Write something"
                              sx={{ height: 330 }}
                              value={value}
                              onChange={onChange}
                            />

                            <FormHelperText error={!!errors?.content?.message}>
                              {errors?.content?.message}
                            </FormHelperText>
                          </Stack>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                      <Typography variant="h6">Meta</Typography>
                    </Grid>
                    <Grid xs={12} lg={8}>
                      <Stack spacing={3}>
                        <Stack spacing={1}>
                          <Typography>SEO title (optional)</Typography>
                          <OutlinedInput
                            fullWidth
                            name="seo_title"
                            placeholder="Type an article SEO title"
                            error={!!errors?.seo_title?.message}
                            helperText={errors?.seo_title?.message}
                            {...register("seo_title")}
                          />
                        </Stack>

                        <Stack spacing={1}>
                          <Typography>SEO description (optional)</Typography>
                          <OutlinedInput
                            fullWidth
                            name="seo_description"
                            placeholder="Type an article SEO description"
                            error={!!errors?.seo_description?.message}
                            helperText={errors?.seo_description?.message}
                            {...register("seo_description")}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>

            <Box
              sx={{
                display: {
                  sm: "none",
                },
                mt: 2,
              }}
            >
              <Button
                component={RouterLink}
                href={paths.dashboard.blog.postDetails}
                variant="contained"
              >
                Publish changes
              </Button>
            </Box>
          </Container>
        </form>
      </Box>

      <ArticleLabelsDialog
        title="Edit Label"
        labels={labels}
        teams={teams}
        open={openLabelModal}
        getLabelList={getLabels}
        onClose={() => setOpenLabelModal(false)}
      />
    </>
  );
};

export default Page;

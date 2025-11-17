// React imports
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

// Third party libraries
import * as yup from "yup";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";

// MUI components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";

// Local imports
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { linkRegExp } from "src/utils/constant";

const CardPreview = ({ card, imagePreview }) => (
  <Grid item xs={6} sx={{ height: "550px" }}>
    <Card sx={{
      height: 1,
      backgroundImage: imagePreview ? (imagePreview.startsWith("blob:") ? `url(${imagePreview})` : `url("${getAPIUrl()}/${imagePreview}")`) : "",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <CardContent
        sx={{
          height: 1,
          transition: 'transform 0.2s ease-in-out',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <Stack
          justifyContent="flex-end"
          spacing={1.5}
          height={1}
        >
          {card?.header && <Typography
            sx={{
              fontStretch: "condensed",
              textTransform: "uppercase",
              color: "#ffffff",
              fontWeight: "600",
            }}
            variant="body2"
          >
            {card?.header}
          </Typography>}
          {card?.title && <Typography variant="h5">{card?.title}</Typography>}
          {card?.description && <Typography variant="h6">{card?.description}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  </Grid>
);

export const ClientCardFormDialog = (props) => {
  const {
    open,
    onClose,
    brandId,
    onSubmit: onSubmitProp,
    card = null,
  } = props;
  const isEdit = !!card;
  const imageRef = useRef(null);

  // Validation schema
  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    header: yup.string().required("Header is required"),
    description: yup.string().required("Description is required"),
    link: yup
      .string()
      .matches(linkRegExp, "Should be a correct URL!")
      .required("Link is required"),
    // Image required only for create
  });

  const { register, control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({ 
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: card?.title || "",
      header: card?.header || "",
      description: card?.description || "",
      link: card?.link || "",
    }
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const title = useWatch({ control, name: "title" });
  const header = useWatch({ control, name: "header" });
  const description = useWatch({ control, name: "description" });

  // Set form values and image preview when editing
  useEffect(() => {
    if (isEdit && card) {
      setValue("title", card?.title || "");
      setValue("header", card?.header || "");
      setValue("description", card?.description || "");
      setValue("link", card?.link || "");
      setImagePreview(card?.image ? (card?.image.startsWith("blob:") ? card?.image : `${process.env.REACT_APP_API_URL || ''}/${card?.image}`) : null);
      setImage(null);
    } else {
      reset();
      setImage(null);
      setImagePreview(null);
    }
    setShowPreview(false);
  }, [open, isEdit, card, setValue, reset]);

  const handleImageAttach = useCallback(() => {
    imageRef?.current?.click();
  }, []);

  const handleChangeImage = useCallback(async (event) => {
    event.preventDefault();
    const file = event?.target?.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleClose = () => {
    reset();
    setImage(null);
    setImagePreview(null);
    setShowPreview(false);
    onClose();
  };

  const onSubmit = async (data) => {
    if (!isEdit && !image) {
      toast.error("Please select an image");
      return;
    }
    try {
      const request = new FormData();
      request.append("internal_brand_id", brandId);
      request.append("title", data?.title);
      request.append("header", data?.header);
      request.append("description", data?.description);
      request.append("link", data?.link);
      if (image) {
        request.append("image", image);
      }
      await onSubmitProp(request);
      toast.success(isEdit ? "Card successfully updated!" : "Card successfully created!");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Stack pl={{xs: 3, md: 5}} pt={{xs: 4, md: 6}} pb={{xs: 3, md: 4}} pr={{xs: 1, md: 3}}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography variant="h5">{isEdit ? "Update Card" : "Create New Card"}</Typography>
          {(imagePreview || image) ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Preview:</Typography>
              <Switch
                checked={showPreview}
                onChange={() => setShowPreview(!showPreview)}
              />
            </Stack>
          ) : null}
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Scrollbar sx={{maxHeight: 500, pr: 1.5, pl: 0.5}}>
            <Stack maxHeight={{xs: 300, md: 420}}>
              {showPreview ? (
                <CardPreview
                  card={{
                    title,
                    header,
                    description,
                  }}
                  imagePreview={imagePreview}
                />
              ) : null}
            </Stack>
            <Stack sx={{ pt: 3 }}>
              <Stack gap={3}>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Typography>{isEdit ? "Change image:" : "Select image:"}</Typography>
                  <Stack>
                    <Button variant="outlined" onClick={handleImageAttach}>
                      {image || imagePreview ? 'Change image' : 'Select image'}
                    </Button>
                    <input
                      hidden
                      ref={imageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                    />
                  </Stack>
                </Stack>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  type="text"
                  error={!!errors?.title}
                  helperText={errors?.title?.message}
                  {...register("title")}
                />

                <TextField
                  fullWidth
                  label="Header"
                  name="header"
                  type="text"
                  error={!!errors?.header}
                  helperText={errors?.header?.message}
                  {...register("header")}
                />

                <TextField
                  fullWidth
                  label="Link"
                  name="link"
                  type="text"
                  error={!!errors?.link}
                  helperText={errors?.link?.message}
                  placeholder="e.g https://test.com"
                  {...register("link")}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  type="text"
                  error={!!errors?.description}
                  helperText={errors?.description?.message}
                  {...register("description")}
                />
              </Stack>
            </Stack>
          </Scrollbar>

          <Stack sx={{ display: "flex", justifyContent: "flex-end", pt: 3, pr: 2 }} direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" disabled={isSubmitting} loading={isSubmitting}>
              {isEdit ? "Update" : "Create"}
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </Dialog>
  );
}; 
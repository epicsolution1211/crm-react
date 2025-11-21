import { useState } from "react";
import { Box, Button, Chip, Divider, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography, useTheme } from "@mui/material";
import { ColorPicker } from "./color-picker";
import { Iconify } from "src/components/iconify";
import { ImageDropzone } from "../../../appearance/login-signup-image/image-dropzone";
import { Link } from "react-router-dom";

const categories = [
    "Sports",
    "Casino",
    "Live Casino",
    "Slots",
    "Poker",
    "Bingo",
    "Lottery",
    "Virtual Sports"
];

export function AddBannerForm() {
    const theme = useTheme();
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    };

    const handleDeleteChip = (categoryToDelete) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== categoryToDelete));
    };
    return (
        <Box>
            <Box sx={{ px: 3, py: 3, borderRadius: "8px", border: "1px solid " + theme.palette.neutral[450] }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Banner Name</InputLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Leave empty if you want without title"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Banner Description</InputLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Leave empty if you want without description"
                            size="small"
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Button Text</InputLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="PLAY NOW"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                            <ColorPicker
                                label="Overlay Color"
                                value={"#000000"}
                                onChange={() => { }}
                            />
                            <IconButton>
                                <Iconify icon="tabler:reload" />
                            </IconButton>
                        </Box>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Button Text</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            placeholder="Select a button text"
                            size="small"
                        >
                            <MenuItem value="Custom URL">Custom URL</MenuItem>
                            <MenuItem value="Category Page">Category Page</MenuItem>
                            <MenuItem value="Assign a Game">Assign a Game</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Button URL</InputLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="https://www.google.com"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Banner visibility</InputLabel>
                        <Select
                            fullWidth
                            multiple
                            variant="outlined"
                            size="small"
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => selected.length === 0 ? "Select category" : `${selected.length} selected`}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedCategories.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
                                {selectedCategories.map((category) => (
                                    <Chip
                                        key={category}
                                        label={category}
                                        onDelete={() => handleDeleteChip(category)}
                                        size="medium"
                                        deleteIcon={<Iconify icon="tabler:x" width={15} />}

                                    />
                                ))}
                            </Stack>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mt: 2, fontSize: '1rem' }} >Upload Jackpot image</Typography>
                        <Typography variant="body2" color="text.secondary"
                            sx={{ fontWeight: 400, fontSize: '0.8rem' }} >Means that the color will be placed as the box border and, shadow and the overlay.</Typography>
                    </Grid>
                </Grid>
                <Box sx={{ pt: 3, px: 3, pb: 3 }}>
                    <ImageDropzone onDrop={() => { }} />
                </Box>

            </Box>
            <Box my={3}>
                <Link to="#" style={{ textDecoration: "underline", color: theme.palette.primary.contrastText }}>+ Add an other banner</Link>
            </Box>
            <Divider />
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                py: 3,
                px: 3
            }}>
                <Button variant="text" color={"inherit"}>Cancel</Button>
                <Button variant="contained">Save Changes</Button>
            </Box>
        </Box>
    );
}
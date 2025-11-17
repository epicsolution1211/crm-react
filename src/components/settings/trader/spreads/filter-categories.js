import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const categories = [
  { label: 'Forex', value: 'forex' },
  { label: 'Commodities', value: 'commodities' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Stocks', value: 'stock' },
];

export const FilterCategories = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Stack sx={{ gap: 1, pb: 3 }}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
        paddingTop={1}
        paddingBottom={2}
      >
        {categories.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            onClick={() => {
              onCategoryChange(item.value);
            }}
            sx={{
              borderColor: "transparent",
              borderRadius: 1.5,
              borderStyle: "solid",
              borderWidth: 2,
              ...(item.value === selectedCategory && {
                borderColor: "primary.main",
              }),
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}; 
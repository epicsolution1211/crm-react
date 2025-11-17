import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';

export const SmsFrom = ({ smsFrom, onSave }) => {
  const [numbers, setNumbers] = useState([
    {
      id: uuid4(),
      value: "",
    },
  ]);

  useEffect(() => {
    if (smsFrom?.length > 0) {
      setNumbers(
        smsFrom?.map((number) => ({
          id: uuid4(),
          value: number,
        }))
      );
    }
  }, [smsFrom]);

  const handleNumberChange = (e, id) => {
    setNumbers((prev) =>
      prev?.map((number) => {
        if (number?.id === id) {
          return {
            ...number,
            value: e?.target?.value,
          };
        } else {
          return number;
        }
      })
    );
  };

  const handleNumberAdd = () => {
    setNumbers((prev) => [...prev, { id: uuid4(), value: "" }]);
  };

  const handleNumberRemove = (id) => {
    setNumbers((prev) => prev?.filter((number) => number?.id !== id));
  };

  const handleSave = () => {
    onSave(numbers?.map((n) => n.value));
  };

  return (
    <Card>
      <CardHeader title="SMS numbers" />

      <CardContent>
        <Grid container>
          <Grid item xs={12} lg={4} md={4} xl={4} sm={10}>
            <Stack spacing={3}>
              {numbers?.map((number, index) => (
                <Stack
                  key={number?.id}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <OutlinedInput
                    fullWidth
                    sx={{ width: "80%" }}
                    placeholder="e.g +35722123546"
                    value={number?.value}
                    onChange={(e) => handleNumberChange(e, number.id)}
                  />

                  {index !== 0 && (
                    <IconButton 
                      onClick={() => handleNumberRemove(number?.id)}
                      sx={{ '&:hover': { color: 'primary.main' }}}
                    >
                      <Iconify icon="gravity-ui:xmark" />
                    </IconButton>
                  )}
                </Stack>
              ))}

              <Button
                variant="outlined"
                onClick={handleNumberAdd}
                sx={{ width: "80%" }}
              >
                + Add phone number
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          py: 4,
          px: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!numbers?.[0]?.value}
        >
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

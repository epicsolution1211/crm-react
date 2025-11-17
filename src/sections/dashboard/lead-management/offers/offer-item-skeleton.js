import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";


export const OfferItemSkeleton = () => {
  // const router = useRouter();
  // const { user } = useAuth();
  // const [active, setActive] = useState(offer?.active ?? false);

  // const handleOfferStatusChange = async () => {
  //   try {
  //     await offersApi.updateOffer(offer?.id, { active: !active });
  //     setActive(!active);
  //     toast.success("Offer status successfully changed!");
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // };

  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Skeleton sx={{width: 24}} variant="text"/>
                  <Skeleton sx={{width: 132}} variant="text"/>
                </Stack>
                <Skeleton variant="text" width="20px"/>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                <Skeleton variant="text" sx={{width: 72}}/>
                <Skeleton variant="text" sx={{width: 24}}/>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

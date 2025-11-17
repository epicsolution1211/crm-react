import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { productMockedData } from 'src/utils/constant/product-mocked-data';
import { paths } from '../../paths';

const Page = () => {
  usePageView();

  const router = useRouter();

  return (
    <>
      <Seo title="Products" />
      <Container>
        <Box
          component="main"
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              lg: 'repeat(2, 1fr)',
              md: 'repeat(1, 1fr)'
            },
            pt: 4,
            pb: 7,
            flexGrow: 1,
            gap: 3
          }}
        >
          {
            productMockedData?.map((item, index) => (
              <Card key={index} sx={{ pt: 4, pb: 2, px: 4, display: "flex", flexDirection: 'column', gap: 2, justifyContent: "space-between" }}>
                <Stack direction="column" gap={2}>
                  <Typography color="primary" variant='h6'>
                    {item.header}
                  </Typography>
                  <Typography>
                    {item.description}
                  </Typography>
                </Stack>
                <Stack direction='row' justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant='text'
                    onClick={() => router.push(`${paths.home.product}/${item?.header}`)}
                  >
                    Learn more
                  </Button>
                </Stack>
              </Card>
            ))
          }
        </Box>
      </Container>
    </>
  );
};

export default Page;

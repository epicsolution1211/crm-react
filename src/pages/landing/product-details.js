import { useMemo } from 'react';
import { useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { productMockedData } from 'src/utils/constant/product-mocked-data';

const Page = () => {
  usePageView();
  const { productId } = useParams();

  const currentPageData = useMemo(() => {
    if (productId) {
      const current = productMockedData.find(item => item.header === productId)
      return current;
    }
  }, [productId])

  return (
    <>
      <Seo title="Product Detail" />
      <Container sx={{ pb: { md: 11, xs: 4 } }}>
        <Stack spacing={1} sx={{ py: { md: 5, sx: 3 } }}>
          <Typography variant="h5">
            {currentPageData?.header ?? ""}
          </Typography>
        </Stack>
        <Stack direction="column" gap={3}>
          {currentPageData?.detailDescription && currentPageData?.detailDescription?.map((item, index) => (
            <Stack direction='column' gap={2} key={index}>
              <Typography variant='h6'>
                {item?.title ?? ""}
              </Typography>
              <Typography
                sx={{'& p': { margin: '0'}, color: 'text.secondary'}}
                dangerouslySetInnerHTML={{ __html: item?.description }} />
            </Stack>
          ))}
          {currentPageData?.features &&
            <Stack direction='column' gap={2} >
              <Typography variant='h6'>
                {currentPageData?.features?.title ?? ""}:
              </Typography>
              <ul style={{ paddingLeft: "20px", marginTop: "2px", marginBottom: "2px", display: 'flex', flexDirection: "column", gap: "2px" }}>
                {currentPageData?.features?.items?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Stack>}
        </Stack>
      </Container>
    </>
  );
};

export default Page;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePageView } from "src/hooks/use-page-view";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { useAuth } from "src/hooks/use-auth";
import { AIQuestionsTable } from "src/sections/dashboard/ai-questions/list";
import { aiSupportApi } from "src/api/ai-support";
import { paths } from "src/paths";
import { useDebounce } from "src/hooks/use-debounce";
import { useRouter } from "src/hooks/use-router";

const Page = () => {
  usePageView();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_ai_questions === false || user?.acc?.acc_v_ai_questions === undefined) {
      router?.push(paths.notFound);
    }
  }, [user])


  const [aiQuestions, setAiQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchText, setSearchText] = useState('');
  const query = useDebounce(searchText, 300);

  const [selectedClient, setSelectedClient] = useState(null);

  const fetchAiQuestions = async () => {
    setLoading(true);
    let params = {
      page: page + 1,
      per_page: rowsPerPage,
      q: query?.length > 0 ? query : null,
      client_id: selectedClient > 0 ? selectedClient : null,
    };
    try {
      const response = await aiSupportApi.getAIQuestions(params);
      setAiQuestions(response?.questions ?? []);
    } catch (err) {
      console.error('err: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiQuestions();
  }, [selectedClient, page, rowsPerPage, query]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("riskPositionsPerPage", newRowsPerPage.toString());
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(0); // Reset to first page when searching
  };

  return (
    <>
      <Seo title={`Dashboard: AI Questions`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 7, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">AI Questions</Typography>
              </Stack>
            </Stack>
            <PayWallLayout>
              <Card>
                <AIQuestionsTable 
                  count={aiQuestions.length}
                  onPageChange={handlePageChange}
                  page={page}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={rowsPerPage}
                  questions={aiQuestions.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )} 
                  isLoading={loading}
                  searchText={searchText}
                  onSearch={handleSearch}
                  onReload={fetchAiQuestions}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                />
              </Card>
            </PayWallLayout>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;


import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { usePageView } from "src/hooks/use-page-view";
import { AIQuestionsTable } from "src/sections/dashboard/ai-questions/list";
import { aiSupportApi } from "src/api/ai-support";
import { useDebounce } from "src/hooks/use-debounce";

export const SettingsAiQuestion = ({ member }) => {
  usePageView();
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
      account_id : member?.id,
      client_id: selectedClient,
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
  }, [selectedClient, query]);

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
    <Card sx={{ '&.MuiCard-root': { boxShadow: 'none' }}}>
      <CardHeader title="AI Questions" />
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
        setSelectedClient={setSelectedClient}
        selectedClient={selectedClient}
      />
    </Card>
  );
};



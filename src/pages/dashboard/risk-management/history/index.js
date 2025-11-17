import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StepContent from '@mui/material/StepContent';

import { settingsApi } from "src/api/settings";
import { Iconify } from 'src/components/iconify';
import { useTimezone } from 'src/hooks/use-timezone';
import { TableNoData } from 'src/components/table-empty';
import { SeverityPill } from 'src/components/severity-pill';

const Page = () => {
  const navigate = useNavigate();
  const { target, id } = useParams();
  const { toLocalTime } = useTimezone();

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetHistory = async () => {
    let itemType = "";

    switch (target) {
      case "position":
        itemType = "Position";
        break;
      case "transaction":
        itemType = "TTransaction";
        break;
      case "bet":
        itemType = "Bet";
        break;
    }

    try {
      setIsLoading(true);
      const res = await settingsApi.getHistory({ item_type: itemType, item_id : id });
      setHistories(res?.history ?? []);
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    handleGetHistory();
  }, [target, id]);

  const renderLogAfter = (log) => {
    if (!log?.before && log?.after && log?.field === "transaction") {
      const validJsonString = log?.after
      .replace(/=>/g, ':')        // Replace => with :
      .replace(/nil/g, 'null')     // Replace nil with null
      .replace(/([a-zA-Z_]+)\s*:/g, '"$1":');

      const afterJSON = JSON.parse(validJsonString);

      return `Created an Approved transaction for amount of ${afterJSON?.amount ?? 0} USD with transaction type ${afterJSON?.transaction_type}`;
    }

    return log?.after;
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack
              direction="row"
              spacing={1}
            >
              <Stack spacing={1} direction="row" alignItems="flex-end">
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size='small' color='primary' onClick={handleBack}>
                    <Iconify icon="ion:arrow-back" width={24} />
                  </IconButton>
                  <Typography variant="h4">
                    History
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <SeverityPill color="success">{target ?? ""}  ID: {id}</SeverityPill>
                </Stack>
              </Stack>
            </Stack>

            <Stack>
              {isLoading ? (
                <Stack spacing={3}>
                  {[1, 2, 3].map((item) => (
                    <Stack key={item} spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={150} height={30} />
                      </Stack>
                      <Stack spacing={1} sx={{ ml: 5, backgroundColor: 'background.paper', p: 2, borderRadius: 1 }}>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="50%" height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="55%" height={20} />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : histories?.length === 0 ? (
                <TableNoData label="No history records found"  hideBorder/>
              ) : (
                <Stepper orientation="vertical">
                  {histories?.map((item, index) => (
                    <Step active key={index}>
                      <StepLabel>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">
                            Field: 
                          </Typography>
                          <Chip label={item?.field ?? ""} size="small" variant="outlined" />
                        </Stack>
                      </StepLabel>
                      <StepContent>
                        <Stack spacing={1} sx={{ backgroundColor: 'background.paper', p: 2, borderRadius: 1 }}>
                          <Typography variant="body2">
                            Before: {item?.before || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            After: {item?.field === "transaction" ? renderLogAfter(item) : item?.after || 'N/A'} 
                          </Typography>
                          <Typography variant="body2">
                            Event: {item?.event || 'N/A'} 
                          </Typography>
                          <Typography variant="body2">
                            Description: {item?.description || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            Client: {item?.client_name || 'N/A'} 
                          </Typography>
                          <Typography variant="body2">
                            Account: {item?.account_name || 'N/A'} 
                          </Typography>
                          <Typography variant="body2">
                            Created: {toLocalTime(item?.created_at)} 
                          </Typography>
                          <Typography variant="body2">
                            Updated: {toLocalTime(item?.updated_at)} 
                          </Typography>
                        </Stack>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};


export default Page;

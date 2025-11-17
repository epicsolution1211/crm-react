import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { toast } from 'react-hot-toast';

import { SeverityPill } from "src/components/severity-pill";
import { recordApi } from 'src/api/payment_audit/record';
import { getAssetPath } from 'src/utils/asset-path';

export const AlertIssue = ({ recordId }) => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getIssues = async () => {
    try {
      setIsLoading(true);
      const params = {
        audit_record_id: recordId
      }
      const res = await recordApi.getIssues(params);
      setIssues(res?.issues);
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  };

  const handleUpdate = async (id, active, index) => {
    try {
      await recordApi.updateIssue(id, { solved: active });
      toast('Issue successfully updated!');
      const newArray = [...issues];
      newArray[index].solved = active;
      setIssues(newArray);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getIssues();
  }, [recordId]);

  return (
    <Card>
      <Box>
        <CardHeader title="Issues" />
        <CardContent>

          <Stack
            direction='column'
            spacing={3}
            justifyContent="space-between">
            {!!issues?.length && <Stack
              direction='row'
              justifyContent='space-between'>
              <Typography>Issue</Typography>
              <Typography>Solved Status</Typography>
            </Stack>}
            {issues?.map((item, index) => (
              <Stack
                key={item?.id}
                direction='row'
                justifyContent='space-between'
              >
                <Stack
                  direction='column'
                  spacing={1}>
                  <Stack
                    direction='row'
                    spacing={2}>
                    <Typography>{index + 1}. {item?.audit_rule?.name ?? 'Issue'}</Typography>
                    {item?.ai_issue && <SeverityPill color={'success'}>
                      AI
                    </SeverityPill>}
                    {item?.code_issue && <SeverityPill color={'success'}>
                      Code
                    </SeverityPill>}
                  </Stack>
                  <Typography variant="subtitle2">Rule Description: {item?.audit_rule?.summary}</Typography>
                  <Typography variant="subtitle2">Detected Issue: {item?.description}</Typography>
                </Stack>
                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'>
                  <Box>
                    <SeverityPill color={'success'}>
                      {item?.solved ? "Solved" : "Unsolved"}
                    </SeverityPill>
                  </Box>
                  <Switch
                    checked={item?.solved}
                    onChange={(event) => handleUpdate(item?.id, event?.target?.checked, index)}
                  />
                </Stack>
              </Stack>
            ))}
            {(!isLoading && !issues?.length) &&
              <Box
                sx={{
                  py: 2,
                  pb: 5,
                  maxWidth: 1,
                  alignItems: 'center',
                  display: 'flex',
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={getAssetPath("/assets/errors/error-404.png")}
                  sx={{
                    height: 'auto',
                    maxWidth: 120,
                  }}
                />
                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                  variant="subtitle1"
                >
                  No Issue.
                </Typography>
              </Box>}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};


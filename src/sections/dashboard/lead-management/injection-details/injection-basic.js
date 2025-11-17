import { useEffect, useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import { SeverityPill } from 'src/components/severity-pill';
import { useAuth } from 'src/hooks/use-auth';
import { format } from 'date-fns';
import { paths } from 'src/paths';

export const InjectionBasic = ({ injection, updateInjection }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');

  const handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.keyCode === 13) {
      updateInjection(injection?.id, { name }, true)
    }
  };

  useEffect(() => {
    if (injection) {
      setName(injection?.name);
    }
  }, [injection]);

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ pt: 4, pl: 3 }}>
        <Typography variant="h5">Injection Basic:</Typography>
        <TextField
          hiddenLabel
          size='small'
          value={name}
          onKeyDown={handleKeyDown}
          disabled={!user?.acc?.acc_e_lm_list}
          onBlur={() => updateInjection(injection?.id, { name }, true)}
          onChange={(event) => setName(event?.target?.value)}
        />
      </Stack>
      <CardContent>
        <Grid container>
          <Grid
            xs={6}
            pr={2}>
            <PropertyList>
              <PropertyListItem
                label="Brand"
                value={injection?.brand?.name ?? ' '}
              />
              <PropertyListItem
                label="Uploaded by"
                value={injection?.account_name ?? ' '}
              />
              <PropertyListItem
                label="Team"
                value={injection?.team_name ?? ' '}
              />
              <PropertyListItem
                label="Agent"
                value={injection?.agent_name ?? ' '}
              />
              <PropertyListItem
                label="Internal Id"
                value={injection?.internal_id ?? ' '}
              />
              {injection?.account_name ? (
                <PropertyListItem
                  label="Affiliate"
                  value={injection?.account_name}
                  link={paths.dashboard.lead.affiliate.index + `/${injection?.account_id}`}
                />
              ) : null}
              <PropertyListItem
                label="Labels"
                value={injection?.labels?.map((item) => (
                  <Chip
                    key={item.name}
                    label={item.name}
                    size='small'
                    color='primary'
                    sx={{ backgroundColor: item?.color ?? "", mr: 1, mt: '2px' }} />))}
              />
              {injection?.created_at ? (
                <PropertyListItem
                  label="Created At"
                  value={format(new Date(injection?.created_at), "yyyy-MM-dd")}
                />
              ) : null}
            </PropertyList>
          </Grid>
          <Grid
            xs={6}
            pl={1} >
            <PropertyList>
              <PropertyListItem
                label="Total Count"
                value={injection?.total_count ?? 0}
              />
              <PropertyListItem
                label="Validated Count"
                value={injection?.validated_count ?? 0}
              />
              <PropertyListItem
                label="Invalid Count"
                value={useMemo(() => (injection?.total_count - injection?.validated_count), [injection]) ?? 0}
              />
              <PropertyListItem
                label="Duplicate Emails"
                value={injection?.duplicate_emails ?? 0}
              />
              <PropertyListItem
                label="Duplicate Phones"
                value={injection?.duplicate_phones ?? 0}
              />
              <PropertyListItem
                label="Dripping"
                value={
                  <SeverityPill
                    sx={{ mt: '2px' }}
                    color={injection?.dripping ? 'success' : 'error'}>
                    {injection?.dripping ? "Active" : "InActive"}
                  </SeverityPill>}
              />
            </PropertyList>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Switch from '@mui/material/Switch';
import { useState, useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';

export const BrandActive = ({ brand, updateBrand }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);

  const handleSwitchChange = (value) => {
    try {
      updateBrand(brand?.id, { active: value });
      setIsActive(value);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    setIsActive(brand?.active)
  }, [brand])

  return (
    <Card>
      <CardHeader title="Brand Active" />
      <CardContent sx={{ pt: 0 }}>
        <Switch
          disabled={!user?.acc?.acc_e_lm_brand}
          checked={isActive ?? false}
          onChange={(event) => handleSwitchChange(event?.target?.checked)}
        />
      </CardContent>
    </Card>
  );
};

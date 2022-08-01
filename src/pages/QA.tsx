import React from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export const QA = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Paper elevation={0}>
        <Typography variant="h3" gutterBottom>
          {t('qa')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {'Q&A'}
        </Typography>
      </Paper>
    </Container>
  );

}
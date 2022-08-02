import React from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';

export const QA = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Paper elevation={0}>
        <Typography variant="h3" gutterBottom>
          {t('qa')}
        </Typography>
        <Divider sx={{mt: 4}}>{t('part1')}</Divider>
        <Typography variant="h4" gutterBottom>
          NFT
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('qal1')}
        </Typography>

        <Typography variant="h5" gutterBottom>
          {t('wisnft')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('qal2')}
        </Typography>
        <Typography variant="body1" sx={{fontWeight: 500}} gutterBottom>
          {t('qal3')}
        </Typography>
        <Divider sx={{mt: 4}}>{t('part2')}</Divider>
        <Typography variant="h4" gutterBottom>
          {t('gasfee')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('qal4')}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t('isf')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('qal5')}
        </Typography>     
        <Typography variant="h6" gutterBottom>
          {t('mention')}
        </Typography>     
        <Typography variant="body1" gutterBottom>
          {t('qal6')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('qal7')}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t('recommend')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('qal8')}
        </Typography>
      </Paper>
    </Container>
  );

}
import React from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';

export const About = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Paper elevation={0}>
        <Typography variant="h3" gutterBottom>
          {t('about')}
        </Typography>
        <Divider sx={{mt: 4}}>{t('part1')}</Divider>
        <Typography variant="h4" gutterBottom>
          {t('project')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('abtl1')}
        </Typography>

        <Typography variant="h5" gutterBottom>
          {t('editor')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('abtl2')}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {t('mwnft')}
        </Typography>
        <Typography variant="body1" sx={{fontWeight: 500}} gutterBottom>
          {t('abtl3')}
        </Typography>
        <Typography variant="body1" sx={{fontWeight: 500}} gutterBottom>
          {t('abtl4')}
        </Typography>
        <Divider sx={{mt: 4}}>{t('part2')}</Divider>
        <Typography variant="h4" gutterBottom>
        {t('team')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('abtl5')}
        </Typography>
        <Divider sx={{mt: 4}}>{t('part3')}</Divider>
        <Typography variant="h4" gutterBottom>
          {t('contact')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <Link href="https://twitter.com/tunyudao">{t('contact')}</Link>
        </Typography>
      </Paper>
    </Container>
  );

}
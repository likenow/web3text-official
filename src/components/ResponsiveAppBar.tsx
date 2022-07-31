import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TranslateIcon from '@mui/icons-material/Translate';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InputIcon from '@mui/icons-material/Input';
import ConnectWallet from './ConnectWallet';
import { useTranslation } from 'react-i18next';
import useTextFileReader from './CustomFileReader';
import { EventBus } from '../EventBus/EventBus';
import { set, get } from '../store';

const settings = ['about', 'qa', 'callus', 'thks'];

const ResponsiveAppBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  
  const {fileContent, isReading, error, trigger} = useTextFileReader();

  const { t, i18n } = useTranslation();
  const [selected, setSelected] = React.useState(false);

  const changeLanguage = () => {
    setSelected(!selected);
    // https://www.i18next.com/overview/api#changelanguage
    let lang = 'en-US';
    if (!selected) {
      lang = 'zh-CN'
    }
    set('language', lang);
    handleLanguage();
  };

  const handleLanguage = () => {
    const languageInStore = get('language') || null;
    if (languageInStore) {
      i18n.changeLanguage(languageInStore, (err, t) => {
        if (err) return console.log('something went wrong loading', err);
      });
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const downloadClick = () => {
    console.log('downloadClick');
    EventBus.getInstance().dispatch<string>('download_html_file_event');
  };

  useEffect(() => {
    if (fileContent) {
      console.log('read file ok');
      EventBus.getInstance().dispatch<string>('import_html_file_event', fileContent);
    }
  }, [fileContent]);

  return (
    <AppBar elevation={1} position="sticky" sx={{marginBottom: '1rem', backgroundColor: '#FFF'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1}}>
            <Button disableTouchRipple
              href='/'
              style={{ backgroundColor: 'transparent', textTransform: 'none' }}
            >
              <img width={32} height={32} alt="Web3text" src="/logo192.png" />
              <Typography variant="h6" sx={{ml:1, color: '#000000'}}>Web3text</Typography>
            </Button>
          </Box>
          <Box>
            <Tooltip title={t('more')}>
              <IconButton size="large" onClick={handleOpenUserMenu}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting: any) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{t(setting)}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title={t('import')}>
              <IconButton size="large" onClick={trigger}>
                <InputIcon />
              </IconButton>
            </Tooltip>
            
            {/* <Tooltip title={t('upload')}>
              <IconButton size="large">
                <CloudUploadIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title={t('download')}>
              <IconButton size="large" onClick={downloadClick}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('enzh')}>
              <IconButton size="large" onClick={changeLanguage}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <ConnectWallet />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

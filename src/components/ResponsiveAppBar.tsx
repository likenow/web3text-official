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
import ShareIcon from '@mui/icons-material/Share';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InputIcon from '@mui/icons-material/Input';
import { get, subscribe } from '../store';
import ConnectWallet, { connectWallet } from './ConnectWallet';
import showMessage from './showMessage';
import { useTranslation } from 'react-i18next';
import useTextFileReader from './CustomFileReader';
import { EventBus } from '../EventBus/EventBus';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ScrollTop(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ConnectSection() {
  const [fullAddress, setFullAddress] = useState(null);
  // const [numberMinted, setNumberMinted] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const fullAddressInStore = get('fullAddress') || null;
      if (fullAddressInStore) {
        const { contract } = await connectWallet();
        // const numberMinted = await contract.numberMinted(fullAddressInStore);
        // setNumberMinted(parseInt(numberMinted));
        setFullAddress(fullAddressInStore);
      }
      subscribe('fullAddress', async () => {
        const fullAddressInStore = get('fullAddress') || null;
        setFullAddress(fullAddressInStore);
        if (fullAddressInStore) {
          // const { contract } = await connectWallet();
        }
      });
    })();
  }, []);

  useEffect(() => {
    try {
      const fullAddressInStore = get('fullAddress') || null;
      if (fullAddressInStore) {
        // const { contract } = await connectWallet();
      }
    } catch (err: any) {
      showMessage({
        type: 'error',
        title: t('getcontractE'),
        body: err.message,
      });
    }
  }, []);
  
  return (
    <>
      <ConnectWallet />{' '}
    </>
  );
}

const ResponsiveAppBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const {fileContent, isReading, error, trigger} = useTextFileReader();

  const { t, i18n } = useTranslation();
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const downloadClick = () => {
    console.log('downloadClick');
    EventBus.getInstance().dispatch<string>('download_html_file_event');
  }

  useEffect( () => {
    if (fileContent) {
      console.log('read file ok');
      EventBus.getInstance().dispatch<string>('import_html_file_event', fileContent);
    }
  }, [fileContent]);

  return (
    <AppBar elevation={1} position="static" sx={{marginBottom: '1rem', backgroundColor: '#FFF'}}>
      <Container maxWidth="xl">
        <Toolbar id="back-to-top-anchor" disableGutters>
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
            <Tooltip title={t('opensetting')}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title={t('import')}>
              <IconButton onClick={trigger}>
                <InputIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('upload')}>
              <IconButton>
                <CloudUploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('download')}>
              <IconButton onClick={downloadClick}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('share')}>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('enzh')}>
              <IconButton onClick={() => {
                // https://www.i18next.com/overview/api#changelanguage
                i18n.changeLanguage('zh-CN', (err, t) => {
                  if (err) return console.log('something went wrong loading', err);
                });
              }}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <ConnectSection />
          </Box>
        </Toolbar>
      </Container>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </AppBar>
  );
};
export default ResponsiveAppBar;

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

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ConnectSection() {
  const [fullAddress, setFullAddress] = useState(null);
  // const [numberMinted, setNumberMinted] = useState(0);

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
        title: '获取合约状态失败',
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
    <AppBar color="inherit" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1}}>
            <Button disableTouchRipple
              href='/'
              style={{ backgroundColor: 'transparent', textTransform: 'none' }}
            >
              <img width={32} height={32} alt="Web3text" src="/logo192.png" />
              <Typography variant="h6" sx={{ml:1, color: 'black'}}>Web3text</Typography>
            </Button>
          </Box>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
            <Tooltip title="import">
              <IconButton onClick={trigger}>
                <InputIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="upload">
              <IconButton>
                <CloudUploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="download">
              <IconButton onClick={downloadClick}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="share">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="en/zh">
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
    </AppBar>
  );
};
export default ResponsiveAppBar;

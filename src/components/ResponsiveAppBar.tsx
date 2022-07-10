import * as React from 'react';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import TranslateIcon from '@mui/icons-material/Translate';
import { useState, useEffect } from 'react';
import { get, subscribe } from '../store';
import ConnectWallet, { connectWallet } from './ConnectWallet';
import showMessage from './showMessage';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
            <IconButton>
              <FileDownloadOffIcon />
            </IconButton>
            <IconButton>
              <FileUploadIcon />
            </IconButton>
            <IconButton>
              <FileDownloadIcon />
            </IconButton>
            <IconButton onClick={() => {
              i18n.changeLanguage('zh', (err, t) => {
                // console.log('something went wrong loading', err);
              });
            }}>
              <TranslateIcon />
            </IconButton>
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

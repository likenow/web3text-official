import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, subscribe } from '../store';
import { connectWallet } from './ConnectWallet';
import showMessage from './showMessage';
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js';
import html2canvas from 'html2canvas';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';

const shares = [
  { icon: <TwitterIcon />, name: 'Twitter' },
  { icon: <FacebookIcon />, name: 'Facebook' },
  { icon: <TelegramIcon />, name: 'Telegram' },
];

const actions = [
  { icon: <SaveIcon />, name: 'save' },
  { icon: <PrintIcon />, name: 'print' },
  { icon: <ShareIcon />, name: 'share' },
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ETHERSCAN_DOMAIN =
  process.env.REACT_APP_CHAIN_ID === '1'
    ? 'etherscan.io'
    : 'rinkeby.etherscan.io';

const StyledMintButton = styled.div`
  display: inline-block;
  width: 100px;
  font-size: 14px;
  text-align: center;
  margin-top: 4px;
  padding: 5px 0;
  border-radius: 16px;
  color: #FFF;
  background: #EEE;
  cursor: ${(props: any) => {
    return props.minting || props.disabled ? "not-allowed" : "pointer";
  }};
  opacity: ${(props: any) => {
    return props.minting || props.disabled ? 0.6 : 1;
  }};
`;

function Mint() {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState('0');
  const [fullAddress, setFullAddress] = useState(null);
  // const [numberMinted, setNumberMinted] = useState(0);
  const [minting, setMinting] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hud, setHud] = useState(false);
  const [articleCanvas, setArticleCanvas] = useState(null);
  const [nftName, setName] = useState('My Title');
  const [nftDescription, setDescription] = useState('My Description');
  // const [nameVerified, setNameVerified] = useState(false);
  // const [descriptionVerified, setDescriptionVerified] = useState(false);
  const { t } = useTranslation();
  const [anchorElShare, setAnchorElShare] = React.useState<null | HTMLElement>(null);

  const handleOpenShareMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElShare(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setAnchorElShare(null);
  }

  const handleMenuItemClick = (operation: string) => {
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.target = '_blank';
    if (operation == 'Twitter') {
      // Twitter
      const shareTwiter = `https://twitter.com/intent/tweet`;
      a.href = shareTwiter;
    } else if (operation == 'Facebook') {
      // Facebook
      const shareFacebook = `https://www.facebook.com/sharer/sharer.php`;
      a.href = shareFacebook;
    } else if (operation == 'Telegram') {
      // Telegram
      const shareTelegram = `https://t.me/share`;
      a.href = shareTelegram;
    }
    a.setAttribute('style', 'display: none');
    a.click();
    a.remove();
  }

  async function updateStatus(contract: any) {
    const status = await contract.status();
    setStatus(status.toString());
    console.log('status = ', status);
    // 在 mint 事件的时候更新数据
    const onMint = async () => {
      const status = await contract.status();
      setStatus(status.toString());
    };
    contract.on('Minted', onMint);
  }

  useEffect(() => {
    (async () => {
      try {
        const fullAddressInStore = get('fullAddress') || null;
        if (fullAddressInStore) {
          const { contract } = await connectWallet();
          setFullAddress(fullAddressInStore);
          updateStatus(contract);
        }
      } catch (err: any) {
        showMessage({
          type: 'error',
          title: t('getcontractE'),
          body: err.message,
        });
      }
      subscribe('fullAddress', async () => {
        const fullAddressInStore = get('fullAddress') || null;
        setFullAddress(fullAddressInStore);
        if (fullAddressInStore) {
          const { contract } = await connectWallet();
          // const numberMinted = await contract.numberMinted(fullAddressInStore);
          // setNumberMinted(parseInt(numberMinted));
          // console.log('local number = ', numberMinted);
          updateStatus(contract);
        }
      });
    })();
  }, []);

  async function storeArticleNFT(image: Blob) {
    const url = URL.createObjectURL(image);
    console.log('store Article NFT = ', url);
    const nft = {
      image, // use image Blob as `image` field
      name: nftName,
      description: nftDescription
    }
    const tk = process.env.REACT_APP_NFT_STORAGE_API_KEY;
    console.log('tk = ', tk);
    const client = new NFTStorage({ token: tk });
    const metadata = await client.store(nft);
    console.log('NFT data stored!');
    console.log('Metadata URI: ', metadata.url);
    getArticleNFT(metadata.url);
  }
  
  // rewrite ipfs:// uris to dweb.link gateway URLs
  function makeGatewayURL(ipfsURI: string) {
    return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
  }
  
  async function fetchIPFSJSON(ipfsURI: string) {
    const url = makeGatewayURL(ipfsURI);
    try {
      const resp = await fetch(url);
      let result = resp.json();
      // console.log('result = ', result);
      return result;
    } catch (error) {
      console.log('fetchIPFSJSON error = ', error);
    }
    
  }
  
  // getArticleNFT('ipfs://bafyreiaw3j2mpjk5linklxoocs3tcv2d2hdmk344zndieuajx3ocwjvv5u/metadata.json');
  async function getArticleNFT(ipfsURI: string) {
    let metadata = await fetchIPFSJSON(ipfsURI) as any;
    if (metadata) {
      let url = metadata.image;
      console.log(url);
      if (url) {
        mintArticle(url);
      } else {
        const message = t('urlempty');
        enqueueSnackbar(message, { variant: 'error' });
      }
    } else {
      const message = t('dataempty');
      enqueueSnackbar(message, { variant: 'error' });
    }
  }
  
  async function mintArticle(url: string) {
    try {
      if (fullAddress) {
        const { signer, contract } = await connectWallet();
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.mint(url, fullAddress);
        console.log('tx == ',tx);
        const response = await tx.wait();
        console.log('res == ',response);
        showMessage({
          type: 'success',
          title: t('mintS'),
          body: (
            <div>
              <a
                href={`https://${ETHERSCAN_DOMAIN}/tx/${response.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {t('seedetail')}
              </a>
              {t('or')}
              <a
                href="https://opensea.io/account"
                target="_blank"
                rel="noreferrer"
              >
                {t('seeopensea')}
              </a>
            </div>
          ),
        });
      }
    } catch (err: any) {
      console.log(err);
      showMessage({
        type: 'error',
        title: t('mintE'),
        body: err.message,
      });
    }
  }
  
  function canvas2Blob(canvas: any) {
    // if (nftName.length == 0) {
    //   setNameVerified(true);
    //   return;
    // }
    // if (nftDescription.length == 0) {
    //   setDescriptionVerified(true);
    //   return;
    // }
    // if (nameVerified) {
    //   return;
    // }
    // if (descriptionVerified) {
    //   return;
    // }
    setHud(true);
    setMinting(true);
    if (canvas) {
      canvas.toBlob(function(blob: any){
        const data = blob as Blob;
        // storeArticleNFT(data);
        console.log('canvas data == ', data);
      }, "image/jpeg", 0.95); // JPEG at 95% quality
    } else {
      const message = t('canvsempty');
      enqueueSnackbar(message, { variant: 'error' });
    }
  }

  // https://html2canvas.hertzen.com/configuration
  async function texts2Image() {
    setOpen(true);
    setLoading(true);
    let editorContainer = document.getElementById('editorContainer') as HTMLElement;
    let opts = {
      useCORS: true,
      x: 0,
      y: 0
    }
    html2canvas(editorContainer, opts).then(canvas => {
      if (canvas) {
        const c = canvas as any;
        setArticleCanvas(c);
        let preview = document.getElementById('preview_texts_canvas') as HTMLElement;
        // console.log(preview);
        preview.appendChild(c);
        setLoading(false);
      } else {
        const message = t('canvsempty');
        enqueueSnackbar(message, { variant: 'error' });
      }
    });
  }

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleName = (event: any) => {
    // console.log('handleName = ', event.target.value);
    if (event.target.value.length > 50) {
      // console.log('超过字数限制 => ', event.target.value);
      const message = t('wordlimit');
      enqueueSnackbar(message, { variant: 'warning', preventDuplicate: true });
      // setNameVerified(true);
      return;
    }
    setName(event.target.value);
    // setNameVerified(false);
  }

  const handleDescription = (event: any) => {
    // console.log('handleDescription = ', event.target.value);
    if (event.target.value.length > 150) {
      // console.log('超过字数限制 => ', event.target.value);
      const message = t('wordlimit');
      enqueueSnackbar(message, { variant: 'warning', preventDuplicate: true });
      // setDescriptionVerified(true);
      return;
    }
    setDescription(event.target.value);
    // setDescriptionVerified(false);
  }

  const handleSpeedDialClick = (e: any, operation: string) => {
    if (operation == 'save') {
      const a: HTMLAnchorElement = document.createElement('a');
      document.body.appendChild(a);
      if (articleCanvas) {
        console.log('save jpeg');
        const canvas = articleCanvas as any;
        canvas.toBlob(function(blob: any){
          const url = URL.createObjectURL(blob);
          console.log('url = ',url);
          a.download = 'YourArticle.jpeg';
          a.href = url;
          a.setAttribute('style', 'display: none');
          a.click();
          a.remove();
          // free up storage--no longer needed.
          URL.revokeObjectURL(url);
        }, "image/jpeg", 0.95); // JPEG at 95% quality
      } else {
        const message = t('canvsempty');
        enqueueSnackbar(message, { variant: 'error' });
      }
    } else if (operation == 'share') {
      handleOpenShareMenu(e);
    } else if (operation == 'print') {
      let iframe = document.createElement('iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.setAttribute(
          "style",
          "position:absolute;width:0px;height:0px;left:-500px;top:-500px;"
        );
        document.body.appendChild(iframe);
        const cw = iframe.contentWindow;
        if (cw) {
          const doc = cw.document;
          const canvas = articleCanvas as any;
          if (canvas) {
            console.log('print jpeg');
            canvas.toBlob(function(blob: any){
              const url = URL.createObjectURL(blob);
              console.log('url = ',url);
              // @ts-ignore
              doc.___imageLoad___ = function () {
                  cw.print();
                  document.body.removeChild(iframe);
                  // free up storage--no longer needed.
                  URL.revokeObjectURL(url);
              };
              const printContentHtml = '<div style="height: 100%;width: 100%;">' + `<img src="${url}" style="max-height:100%;max-width: 100%;" onload="___imageLoad___()"/>` + '</div>';
              doc.write(printContentHtml);
              doc.close();
              cw.focus();
            }, "image/jpeg", 1.0); // JPEG at 100% quality
          } else {
            const message = t('canvsempty');
            enqueueSnackbar(message, { variant: 'error' });
          }
        }
      }
    }
  }

  let mintButton = (
    <StyledMintButton
      style={{
        background: '#EEE',
        color: '#999',
        cursor: 'not-allowed',
      }}
    >
      未开始
    </StyledMintButton>
  );

  if (!fullAddress) {
    mintButton = (
      <StyledMintButton
        style={{
          background: '#EEE',
          color: '#999',
          cursor: 'not-allowed',
        }}
      >
        { t('uncw') }
      </StyledMintButton>
    );
  } else {
    mintButton = (
      <div
        style={{
          display: 'flex',
        }}
      >
        <StyledMintButton
          disabled={false}
          minting={minting}
          onClick={texts2Image}
          style={{
            color: '#FFF',
            background: 'linear-gradient(191deg, #FD2F79 0%, #FD6F6F 100%)',
          }}
        >
          {/* 铸造文章 NFT{minting ? '中...' : ''} */}
          { t('mint') }
        </StyledMintButton>
      </div>
    );
  }
  
  return (
    <div>
      {mintButton}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Backdrop
          sx={{ color: '#FFF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={hud}
          onClick={()=> {
            setHud(false);
          }}
        >
          <CircularProgress sx={{ color: '#FFF'}} />
        </Backdrop>
        <AppBar elevation={1} sx={{ position: 'relative', color: '#000', backgroundColor: '#FFF' }}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleClose}
              aria-label="close"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 1, flexGrow: 1}} variant="h6" component="div">
              {t('close')}
            </Typography>
            <Typography sx={{ flexGrow: 1}} variant="h5" component="div">{t('preview')}</Typography>
            <IconButton
              sx={{ ml: 2 }}
              onClick={async () => {
                if (minting) {
                  return;
                }
                canvas2Blob(articleCanvas);
              }}
            >
              <CheckIcon />
            </IconButton>
            <Typography sx={{ ml: 1}} variant="h6" component="div">
              {t('confirm')}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{maxWidth: 'sm'}}>
          <TextField
            // required
            autoFocus
            // error={nameVerified}
            // id="outlined-required"
            label={t('title')}
            placeholder={t('titleplace')}
            helperText={t('helpertitle')}
            sx={{ mt: 5, mb: 2, width: '100%'}}
            value={nftName}
            onChange={handleName}
          />
          <TextField
            // required
            // error={descriptionVerified}
            // id="outlined-required"
            label={t('desc')}
            placeholder={t('descplace')}
            helperText={t('helperdesc')}
            multiline
            maxRows={4}
            sx={{ mb: 5, width: '100%'}}
            value={nftDescription}
            onChange={handleDescription}
          />
        </Container>
        <div id="preview_texts_canvas" 
          style={{
            width: '70%',
            margin:' 0 auto'
          }}
        />
        <Container>
          {
            loading ? (
              <Box>
                <Typography variant="h1">{loading ? <Skeleton /> : 'h1'}</Typography>
                <Typography variant="h2" width="50%">{loading ? <Skeleton /> : 'h2'}</Typography>
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
                <Skeleton variant="rectangular" width={540} height={260} />
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
                <Typography variant="h3">{loading ? <Skeleton /> : 'h3'}</Typography>
              </Box>
            ) : (
              <></>
            )
          }
        </Container>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action: any) => (
            <SpeedDialAction
              key={t(action.name)}
              icon={action.icon}
              tooltipTitle={t(action.name)}
              onClick={(e) => {
                handleSpeedDialClick(e, action.name);
              }}
            />
          ))}
        </SpeedDial>
        <Menu
          id="basic-menu"
          anchorEl={anchorElShare}
          open={Boolean(anchorElShare)}
          onClose={handleCloseShareMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {shares.map((share: any) => (
            <MenuItem onClick={() => {
              handleMenuItemClick(share.name)
            }} >
              <ListItemIcon> {share.icon} </ListItemIcon>
              <ListItemText> {share.name} </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Dialog>
    </div>
  );
}

export default Mint;

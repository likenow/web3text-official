import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { get, subscribe } from '../store';
import { connectWallet } from './ConnectWallet';
import showMessage from './showMessage';
// import { NFTStorage } from 'nft.storage';
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
import CustomizedSnackbar from './CustomizedSnackbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// const ETHERSCAN_DOMAIN =
//   process.env.REACT_APP_CHAIN_ID === '1'
//     ? 'etherscan.io'
//     : 'rinkeby.etherscan.io';

const StyledMintButton = styled.div`
  display: inline-block;
  width: 140px;
  text-align: center;
  padding: 10px 10px;
  border: 1px solid #000;
  border-radius: 16px;
  color: #000;
  background: #eee;
  cursor: ${(props: any) => {
    return props.minting || props.disabled ? "not-allowed" : "pointer";
  }};
  opacity: ${(props: any) => {
    return props.minting || props.disabled ? 0.6 : 1;
  }};
`;

async function storeArticleNFT(image: Blob) {
  const url = URL.createObjectURL(image);
  console.log('storeArticleNFT = ', url);
  // const nft = {
  //   image, // use image Blob as `image` field
  //   name: 'texts',
  //   description: 'web3text'
  // }
  // const tk = process.env.REACT_APP_NFT_STORAGE_API_KEY;
  // console.log('tk = ', tk);
  // const client = new NFTStorage({ token: tk })
  // const metadata = await client.store(nft)
  // console.log('NFT data stored!')
  // console.log('Metadata URI: ', metadata.url)
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
  // image url
  if (metadata) {
    let url = makeGatewayURL(metadata.image);
    console.log('image = ', url);
    // let img = document.getElementById('articleIMG') as HTMLImageElement;
    // if (url) {
    //   img.src = url;
    //   document.body.appendChild(canvas);
    // }
  }
}

function saveImageFromCanvas(canvas: any) {
  if (canvas) {
    canvas.toBlob(function(blob: any){
      const data = blob as Blob;
      storeArticleNFT(data);
    }, "image/jpeg", 0.95); // JPEG at 95% quality
  }
}

function MintButton(props: any) {
  const [minting, setMinting] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [hud, setHud] = useState(false);
  const [articleCanvas, setArticleCanvas] = useState(null);
  
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
        setShowMsg(true);
      }
    });
  }

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <CustomizedSnackbar
        type="error"
        show={showMsg}
        title="图片转换失败"
        vertical="top"
        horizontal="center"
        onClose={()=> {
          setShowMsg(false);
        }}
      />
      <StyledMintButton
        disabled={!!props.disabled}
        minting={minting}
        onClick={texts2Image}
        style={{
          background: '#fff',
          ...props.style,
        }}
      >
        铸造文章 NFT{minting ? '中...' : ''}
      </StyledMintButton>
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={hud}
          onClick={()=> {
            setHud(false);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar color="inherit" sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 1, flexGrow: 1}} variant="h6" component="div">
              Close
            </Typography>
            
            <IconButton
              color="inherit"
              sx={{ ml: 2 }}
              onClick={async () => {
                if (minting || props.disabled) {
                  return;
                }
                setHud(true);
                setMinting(true);
                saveImageFromCanvas(articleCanvas);
                try {
                  // const { signer, contract } = await connectWallet();
                  // const contractWithSigner = contract.connect(signer);
                  // const value = ethers.utils.parseEther(
                  //   props.mintAmount === 1 ? '0.01' : '0.02'
                  // );
                  // const tx = await contractWithSigner.mint(props.mintAmount, {
                  //   value,
                  // });
                  // const response = await tx.wait();
                  // showMessage({
                  //   type: 'success',
                  //   title: '铸造成功',
                  //   body: (
                  //     <div>
                  //       <a
                  //         href={`https://${ETHERSCAN_DOMAIN}/tx/${response.transactionHash}`}
                  //         target="_blank"
                  //         rel="noreferrer"
                  //       >
                  //         点击查看交易详情
                  //       </a>{' '}
                  //       或者到{' '}
                  //       <a
                  //         href="https://opensea.io/account"
                  //         target="_blank"
                  //         rel="noreferrer"
                  //       >
                  //         OpenSea 查看
                  //       </a>
                  //       。
                  //     </div>
                  //   ),
                  // });
                } catch (err: any) {
                  showMessage({
                    type: 'error',
                    title: '铸造失败',
                    body: err.message,
                  });
                }
                props.onMinted && props.onMinted();
                setMinting(false);
              }}
            >
              <CheckIcon />
            </IconButton>
            <Typography sx={{ ml: 1}} variant="h6" component="div">
              Mint
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{maxWidth: 'sm'}}>
          <TextField
            required
            autoFocus
            id="outlined-required"
            label="Required"
            placeholder="Title"
            helperText="Title.(< 50 characters)"
            sx={{ mt: 5, mb: 2, width: '100%'}}
          />
          <TextField
            required
            id="outlined-required"
            label="Required"
            placeholder="Description of your Article"
            helperText="Description.(< 150 characters)"
            multiline
            maxRows={4}
            sx={{ mb: 5, width: '100%'}}
          />
        </Container>
        <div id="preview_texts_canvas" />
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
      </Dialog>
    </div>
  );
}

function Mint() {
  const [status, setStatus] = useState('0');
  const [progress, setProgress] = useState<number | null>(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [numberMinted, setNumberMinted] = useState(0);

  async function updateStatus() {
    // const { contract } = await connectWallet();
    // const status = await contract.status();
    // const progress = parseInt(await contract.totalSupply());
    // setStatus(status.toString());
    // setProgress(progress);
    // // 在 mint 事件的时候更新数据
    // const onMint = async () => {
    //   const status = await contract.status();
    //   const progress = parseInt(await contract.totalSupply());
    //   setStatus(status.toString());
    //   setProgress(progress);
    // };
    // contract.on('Minted', onMint);
  }

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
          const { contract } = await connectWallet();
          // const numberMinted = await contract.numberMinted(fullAddressInStore);
          // setNumberMinted(parseInt(numberMinted));
          updateStatus();
        }
      });
    })();
  }, []);

  useEffect(() => {
    try {
      const fullAddressInStore = get('fullAddress') || null;
      if (fullAddressInStore) {
        updateStatus();
      }
    } catch (err: any) {
      showMessage({
        type: 'error',
        title: '获取合约状态失败',
        body: err.message,
      });
    }
  }, []);

  async function refreshStatus() {
    const { contract } = await connectWallet();
    // const numberMinted = await contract.numberMinted(fullAddress);
    // setNumberMinted(parseInt(numberMinted));
  }

  let mintButton = (
    <StyledMintButton
      style={{
        background: '#eee',
        color: '#999',
        cursor: 'not-allowed',
      }}
    >
      尚未开始
    </StyledMintButton>
  );

  if (status === '1') {
    mintButton = (
      <div>
        <MintButton
          onMinted={refreshStatus}
          mintAmount={1}
          style={{ marginRight: '20px' }}
        />
      </div>
    );
  }
  if (progress) {
    if (progress > 1400000000 || status === '2') {
        mintButton = (
          <StyledMintButton
            style={{
              background: '#eee',
              color: '#999',
              cursor: 'not-allowed',
            }}
          >
            禁止铸造
          </StyledMintButton>
        );
      }
  } else {
    console.log('❌ progress is null');
  }

  if (numberMinted === 100) {
    mintButton = (
      <StyledMintButton
        style={{
          background: '#eee',
          color: '#999',
          cursor: 'not-allowed',
        }}
      >
        铸造已达上限
      </StyledMintButton>
    );
  }

  if (!fullAddress) {
    mintButton = (
      <StyledMintButton
        style={{
          background: '#eee',
          color: '#999',
          cursor: 'not-allowed',
        }}
      >
        请先连接钱包
      </StyledMintButton>
    );
  } else {
    mintButton = (
      <div
        style={{
          display: 'flex',
        }}
      >
        <MintButton
          onMinted={refreshStatus}
          mintAmount={1}
          style={{ marginRight: '20px' }}
        />
      </div>
    );
  }
  
  return (
    <>
      {mintButton}
    </>
  );
}

export default Mint;

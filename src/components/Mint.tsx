import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { get, subscribe } from "../store";
import { connectWallet } from "./ConnectWallet";
import showMessage from "./showMessage";
// import { NFTStorage } from 'nft.storage';
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js';
import html2canvas from 'html2canvas';

// const ETHERSCAN_DOMAIN =
//   process.env.REACT_APP_CHAIN_ID === "1"
//     ? "etherscan.io"
//     : "rinkeby.etherscan.io";

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

// https://html2canvas.hertzen.com/configuration
async function texts2Image() {
  let editorContainer = document.getElementById('editorContainer') as HTMLElement;
  let opts = {
    useCORS: true,
    x: 0,
    y: 0
  }
  html2canvas(editorContainer, opts).then(canvas => {
      // document.body.appendChild(canvas);
      canvas.toBlob(function(blob){
        const data = blob as Blob
        storeArticleNFT(data);
      }, "image/jpeg", 0.95); // JPEG at 95% quality
  });
}

async function storeArticleNFT(image: Blob) {
  const nft = {
    image, // use image Blob as `image` field
    name: "texts",
    description: "web3text"
  }
  const tk = process.env.REACT_APP_NFT_STORAGE_API_KEY;
  console.log('tk = ', tk);
  const client = new NFTStorage({ token: tk })
  const metadata = await client.store(nft)
  console.log('NFT data stored!')
  console.log('Metadata URI: ', metadata.url)
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

async function getArticleNFT(ipfsURI: string) {
  let metadata = await fetchIPFSJSON(ipfsURI) as any;
  // image url
  if (metadata) {
    let image = makeGatewayURL(metadata.image)
    console.log('image = ', image);
  }
}

function MintButton(props: any) {
  const [minting, setMinting] = useState(false);

  return (
    <StyledMintButton
      disabled={!!props.disabled}
      minting={minting}
      onClick={async () => {
        if (minting || props.disabled) {
          return;
        }
        setMinting(true);
        try {
          getArticleNFT('ipfs://bafyreiaw3j2mpjk5linklxoocs3tcv2d2hdmk344zndieuajx3ocwjvv5u/metadata.json');
          // texts2Image();


          // const { signer, contract } = await connectWallet();
          // const contractWithSigner = contract.connect(signer);
          // const value = ethers.utils.parseEther(
          //   props.mintAmount === 1 ? "0.01" : "0.02"
          // );
          // const tx = await contractWithSigner.mint(props.mintAmount, {
          //   value,
          // });
          // const response = await tx.wait();
          // showMessage({
          //   type: "success",
          //   title: "铸造成功",
          //   body: (
          //     <div>
          //       <a
          //         href={`https://${ETHERSCAN_DOMAIN}/tx/${response.transactionHash}`}
          //         target="_blank"
          //         rel="noreferrer"
          //       >
          //         点击查看交易详情
          //       </a>{" "}
          //       或者到{" "}
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
            type: "error",
            title: "铸造失败",
            body: err.message,
          });
        }
        props.onMinted && props.onMinted();
        setMinting(false);
      }}
      style={{
        background: "#fff",
        ...props.style,
      }}
    >
      铸造文章 NFT{minting ? "中..." : ""}
    </StyledMintButton>
  );
}

function Mint() {
  const [status, setStatus] = useState("0");
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
    // contract.on("Minted", onMint);
  }

  useEffect(() => {
    (async () => {
      const fullAddressInStore = get("fullAddress") || null;
      if (fullAddressInStore) {
        const { contract } = await connectWallet();
        // const numberMinted = await contract.numberMinted(fullAddressInStore);
        // setNumberMinted(parseInt(numberMinted));
        setFullAddress(fullAddressInStore);
      }
      subscribe("fullAddress", async () => {
        const fullAddressInStore = get("fullAddress") || null;
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
      const fullAddressInStore = get("fullAddress") || null;
      if (fullAddressInStore) {
        updateStatus();
      }
    } catch (err: any) {
      showMessage({
        type: "error",
        title: "获取合约状态失败",
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
        background: "#eee",
        color: "#999",
        cursor: "not-allowed",
      }}
    >
      尚未开始
    </StyledMintButton>
  );

  if (status === "1") {
    mintButton = (
      <div>
        <MintButton
          onMinted={refreshStatus}
          mintAmount={1}
          style={{ marginRight: "20px" }}
        />
      </div>
    );
  }
  if (progress) {
    if (progress > 1400000000 || status === "2") {
        mintButton = (
          <StyledMintButton
            style={{
              background: "#eee",
              color: "#999",
              cursor: "not-allowed",
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
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
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
          background: "#eee",
          color: "#999",
          cursor: "not-allowed",
        }}
      >
        请先连接钱包
      </StyledMintButton>
    );
  } else {
    mintButton = (
      <div
        style={{
          display: "flex",
        }}
      >
        <MintButton
          onMinted={refreshStatus}
          mintAmount={1}
          style={{ marginRight: "20px" }}
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

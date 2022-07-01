import React from 'react';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Chip from "@mui/material/Chip";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import showMessage from "./showMessage";
import { set, get, subscribe } from "../store";
import { formatAddress } from "../utils";
// import RinkebyContractABI from "../abi/rinkeby.json";
// import MainnetContractABI from "../abi/mainnet.json";

// const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
// const NETWORK = CHAIN_ID === "1" ? "mainnet" : "rinkeby";
// const contractABI = CHAIN_ID === "1" ? MainnetContractABI : RinkebyContractABI;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
    },
  },
};

let web3ModelInstance: any;
if (typeof window !== "undefined") {
  web3ModelInstance = new Web3Modal({
    network: process.env.REACT_APP_CHAIN_ID === "1" ? "mainnet" : "rinkeby",
    cacheProvider: true,
    providerOptions,
  });
}

let provider: any;
let signer: any;
let instance: any;
let contract: any;

export async function connectWallet() {
  if (!instance) {
    instance = await web3ModelInstance.connect();
    // https://docs.ethers.io/v5/api/providers/
    provider = new ethers.providers.Web3Provider(instance);
    // https://docs.ethers.io/v5/api/signer/
    signer = provider.getSigner();
    // contract = new ethers.Contract(
    //   process.env.REACT_APP_CONTRACT_ADDRESS,
    //   // 注意 ABI 的大小写
    //   contractABI.abi,
    //   provider
    // );
  }

  return { provider, signer, web3Instance: instance, contract };
}

async function disconnectWallet() {
  provider = undefined;
  signer = undefined;
  instance = undefined;
  contract = undefined;
  await web3ModelInstance.clearCachedProvider();
}

function ConnectWallet(props: any) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addressInStore = get("address") || null;
    if (addressInStore) {
      setAddress(addressInStore);
    }
    subscribe("address", () => {
      const addressInStore = get("address") || null;
      setAddress(addressInStore);
    });
  }, []);

  if (address && !loading) {
    return (
      <Chip
        label={address}
        color="primary"
        onDelete={async () => {
          await disconnectWallet();
          setAddress(null);
          set("address", "");
          set("fullAddress", "");
        }}
      />
    );
  }

  return (
    <>
      <Chip
        icon={<AccountBalanceWalletIcon />}
        style={{ fontSize: 16 }}
        label={loading ? "连接中..." : "连接钱包"}
        color="primary"
        onClick={async () => {
          setLoading(true);
          try {
            const { provider, signer, web3Instance } = await connectWallet();
            const address = await signer.getAddress();
            const ens = await provider.lookupAddress(address);
            setAddress(ens || formatAddress(address));
            set("address", ens || formatAddress(address));
            set("fullAddress", address);
            web3Instance.on("accountsChanged", async (accounts: string | any[]) => {
              if (accounts.length === 0) {
                await disconnectWallet();
                set("address", "");
                set("fullAddress", "");
                setAddress(null);
              } else {
                const address = accounts[0];
                const ens = await provider.lookupAddress(address);
                setAddress(ens || formatAddress(address));
                set("address", ens || formatAddress(address));
                set("fullAddress", address);
              }
            });
          } catch (err: any) {
            await disconnectWallet();
            set("address", "");
            set("fullAddress", "");
            setAddress(null);
            showMessage({
              type: "error",
              title: "连接钱包失败，请重试",
              body: err.message,
            });
          }
          setLoading(false);
        }}
      />
    </>
  );
}

export default ConnectWallet;

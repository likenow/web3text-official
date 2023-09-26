import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTranslation } from 'react-i18next';
import { EventBus } from '../EventBus/index';

import showMessage from './showMessage';
import { set, get, subscribe } from '../store';
import { formatAddress } from '../utils';
import RinkebyContractABI from '../abi/rinkeby.json';
import MainnetContractABI from '../abi/mainnet.json';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const NETWORK = CHAIN_ID === '1' ? 'mainnet' : 'rinkeby';
const contractABI = CHAIN_ID === '1' ? MainnetContractABI : RinkebyContractABI;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as string;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
    },
  },
};

let web3ModelInstance: any;
if (typeof window !== 'undefined') {
  web3ModelInstance = new Web3Modal({
    network: NETWORK,
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
    contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      provider
    );
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
  const { t } = useTranslation();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addressInStore = get('address') || null;
    if (addressInStore) {
      setAddress(addressInStore);
    }
    subscribe('address', () => {
      const addressInStore = get('address') || null;
      setAddress(addressInStore);
    });
  }, []);

  const disconnect = async () => {
    // console.log('disconnect called');
    await disconnectWallet();
    setAddress(null);
    set('address', '');
    set('fullAddress', '');
    EventBus.getInstance().dispatch<string>('disconnect_wallet_event');
  };

  const connect = async () => {
    setLoading(true);
    try {
      const { provider, signer, web3Instance } = await connectWallet();
      const address = await signer.getAddress();
      const ens = await provider.lookupAddress(address);
      setAddress(ens || formatAddress(address));
      set('address', ens || formatAddress(address));
      set('fullAddress', address);
      web3Instance.on('accountsChanged', async (accounts: string | any[]) => {
        if (accounts.length === 0) {
          await disconnectWallet();
          set('address', '');
          set('fullAddress', '');
          setAddress(null);
        } else {
          const address = accounts[0];
          const ens = await provider.lookupAddress(address);
          setAddress(ens || formatAddress(address));
          set('address', ens || formatAddress(address));
          set('fullAddress', address);
        }
      });
      EventBus.getInstance().dispatch<string>('connect_wallet_event', address);
    } catch (err: any) {
      await disconnectWallet();
      set('address', '');
      set('fullAddress', '');
      setAddress(null);
      showMessage({
        type: 'error',
        title: t('retry'),
        body: err.message,
      });
    }
    setLoading(false);
  };
  if (address && !loading) {
    return (
      <>
        <Chip
          sx={{
            '& .MuiChip-deleteIcon': {
              color: '#AFB7FF',
            },
          }}
          style={{ width: '140', fontSize: 14 , color: '#3C4DF4', backgroundColor: '#ECEEFF'}}
          label={address}
          onDelete={disconnect}
        />
      </>
    );
  } else {
    return (
      <>
        <Chip
          icon={<AccountBalanceWalletIcon sx={{ '&&': { color: '#FFF' } }} />}
          sx={{ 
            width: '140', 
            fontSize: 14 , 
            color: '#FFF', 
            background: 'linear-gradient(180deg, #1D5EE7 0%, #1D30E7 100%)'
          }}
          label={loading ? t('cwing') : t('connectwallet')}
          onClick={connect}
        />
        {loading? <CircularProgress size={15} sx={{ml:'-16px', color: 'white'}} /> : null}
      </>
    );
  }
}

export default ConnectWallet;

import { useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { providers } from "ethers";

export default function Component() {
  const [tokenId, setTokenId] = useState(0);
  const [rate, setRate] = useState(0);
  const [tokenId0, setTokenId0] = useState(0);
  const [rate0, setRate0] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [contract, setContract] = useState(null);

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please switch to the Goerli network");
      throw new Error("Incorrect network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    const signer = await getProviderOrSigner(true);
    const sdk = ThirdwebSDK.fromSigner(signer);

    const contract = await sdk.getContract(
      "0x9d7B3B7F55743bBA41cc4Cc21d7D1660e43411e1"
    );
    console.log(contract);
    setContract(contract);
    setWalletConnected(true);
  };

  const onPageLoad = async () => {
    await connectWallet();
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  });

  const { mutateAsync: vote, isLoading1 } = useContractWrite(contract, "vote");
  const { mutateAsync: getRate, isLoading2 } = useContractWrite(
    contract,
    "getRate"
  );

  const call = async (token_id, rate) => {
    try {
      const data = await vote([token_id, rate]);
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };
  const getRateFunction = async (token_id) => {
    console.log("Started");
    try {
      const data = await getRate([token_id]);
      console.log(data);
      setRate0(parseInt(data["_hex"], 16));
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  if (!contract) {
    return <div>Loading.....</div>;
  }

  return (
    <div>
      <input
        type="number"
        value={tokenId}
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      />
      <input
        type="number"
        value={rate}
        onChange={(e) => {
          setRate(e.target.value);
        }}
      />
      <button
        onClick={() => {
          call(tokenId, rate);
        }}
      >
        Vote
      </button>
      <br />
      <br />
      <input
        type="number"
        value={tokenId0}
        onChange={(e) => {
          setTokenId0(e.target.value);
        }}
      />
      <p>{rate0}</p>
      <button
        onClick={() => {
          getRateFunction(tokenId0);
        }}
      >
        Get Rate
      </button>
    </div>
  );
}

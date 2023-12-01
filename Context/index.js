import React, { useState, useEffect, createContext, useContext} from 'react';
import { ethers } from "ethers";

//internal impmorts 
import {
    CheckIfWalletConnected,
    connectWallet,
    connectingTOKENCONTRACT,
    getBalance,
    connectingTOKEN_SALE_CONTRACT,
} from "../Utils/index";

const StateContext = createContext();

export const StateContextProvider = ({children})=> {
    const TOKEN_ICO = "TOKEN SELL DAPP";

    // STATE VARIABLES
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [nativeToken, setNativeToken] = useState("");
    const [tokenHolders, setTokenHolders] = useState([]);
    const [tokenSale, setTokenSale] = useState("");
    const [currentHolder, setCurrentHolder] = useState("");

    //FETCH CONTRACT DATA
    const fetchInitialData = async () => {
        try {
            //GET USER ACCOUNT
            const account = await CheckIfWalletConnected();
            //GET USER BALANCe
            const balance = await getBalance();
            setBalance(ethers.utils.formatEther(balance.toString()));
            setAddress(account);

            //TOKEN CONTRACT
            const TOKEN_CONTRACT = await connectingTOKENCONTRACT();
            let tokenBalance;
            if(account){
                tokenBalance = await TOKEN_CONTRACT.balanceOf(account)
            } else {
                tokenBalance = 0;
            }

            //GET ALL TOKEN DATA
            const tokenName = await TOKEN_CONTRACT.name();
            const tokenSymbol = await TOKEN_CONTRACT.symbol();
            const tokenTotalSupply = await TOKEN_CONTRACT.totalSupply();
            const tokenStandard = await TOKEN_CONTRACT.standard();
            const tokenHolders = await TOKEN_CONTRACT._userId();
            const tokenOwnerOfContract = await TOKEN_CONTRACT.ownerOfContract();
            const tokenAddress = await TOKEN_CONTRACT.address;

            const nativeToken = {
                tokenAddress: tokenAddress,
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                tokenOwnerOfContract: tokenOwnerOfContract,
                tokenStandard: tokenStandard,
                tokenTotalSupply: ethers.utils.formatEther(tokenTotalSupply.toString()),
                tokenBalance: ethers.utils.formatEther(tokenBalance.toString()),
                tokenHolders: tokenHolders.toNumber(),
            };

            setNativeToken(nativeToken);

            //GETTING TOKEN HOLDERS
            const getTokenHolder = await TOKEN_CONTRACT.getTokenHolder();
            setTokenHolders(getTokenHolder);

            //GETTING TOKEN HOLDER DATA
            if(account){
                const getTokenHolderData = await TOKEN_CONTRACT.getTokenHolderData(
                    account
                );
            }

        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(()=> {
        fetchInitialData();
    }, []);

    return (
        <StateContext.Provider value={{ TOKEN_ICO }}>
            {children}
        </StateContext.Provider>
    ); 
};

export const useStateContext = () => useContext(StateContext);

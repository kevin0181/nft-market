import axios from "axios";
import {COUNT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS} from "../constants";


const A2A_API_PREPARE_URL = 'https://a2a-api.klipwallet.com/v2/a2a/prepare'
const APP_NAME = "KLAY_MARKET";

const isMobile = window.screen.width >= 1280 ? false : true;

const getKlipAccessUrl = (method, request_key) => {
    if (method === "QR") {
        return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    }
    // return `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
    return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`
}

// export const setCount = (count, setQrValue) => {
//
//     axios.post(A2A_API_PREPARE_URL, {
//         bapp: {
//             name: APP_NAME
//         },
//         type: "execute_contract",
//         transaction: {
//             to: COUNT_CONTRACT_ADDRESS,
//             abi: `{ "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }`,
//             value: "0",
//             params: `[\"${count}\"]`
//         }
//     }).then(res => {
//         const {request_key} = res.data;
//
//         const qrCode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
//         setQrValue(qrCode);
//         let timerId = setInterval(() => {
//             axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then(res => {
//                 if (res.data.result) {
//                     console.log(res.data.result);
//                     if (res.data.result.status === "success") {
//                         clearInterval(timerId);
//                     }
//                 }
//             })
//         }, 1000)
//     })
//
// }

export const getAddress = (setQrValue, callback) => {

    axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
        bapp: {
            name: 'KLAY_MARKET'
        },
        type: "auth",
    }).then(res => {
        const {request_key} = res.data;

        if (isMobile) {
            window.location.href = getKlipAccessUrl("ios", request_key);
        } else {
            setQrValue(getKlipAccessUrl("QR", request_key));
        }

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then(res => {
                if (res.data.result) {
                    console.log(res.data.result.klaytn_address);
                    callback(res.data.result.klaytn_address);
                    clearInterval(timerId);
                    setQrValue("DEFAULT")
                }
            })
        }, 1000)
    })
}

export const buyCard = async (tokenId, setQrValue, callback) => {
    const functionJson = '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFTAddress", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
    executeContract(MARKET_CONTRACT_ADDRESS, functionJson, "10000000000000000", `[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`, setQrValue, callback);
}

export const listingCard = async (fromAddress, tokenId, setQrValue, callback) => {
    const functionJson = '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    executeContract(NFT_CONTRACT_ADDRESS, functionJson, "0", `[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`, setQrValue, callback);
}


export const mintCardWithURI = async (toAddress, tokenId, uri, setQrValue, callback) => {
    const functionJson = '{"constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    executeContract(NFT_CONTRACT_ADDRESS, functionJson, "0", `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`, setQrValue, callback);
}

export const executeContract = (txTo, functionJSON, value, params, setQrValue, callback) => {
    axios.post(A2A_API_PREPARE_URL, {
        bapp: {
            name: APP_NAME
        },
        type: "execute_contract",
        transaction: {
            to: txTo,
            abi: functionJSON,
            value: value,
            params: params
        }
    }).then(res => {
        const {request_key} = res.data;

        if (isMobile) {
            window.location.href = getKlipAccessUrl("ios", request_key);
        } else {
            setQrValue(getKlipAccessUrl("QR", request_key));
        }

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then(res => {
                if (res.data.result) {
                    console.log(res.data.result);
                    if (res.data.result.status === "success") {
                        callback(res.data.result);
                        clearInterval(timerId);
                        setQrValue("DEFAULT")
                    }
                }
            })
        }, 1000)
    })
}
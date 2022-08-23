import logo from './logo.svg';
import './App.css';
import './market.css';
import {getBalance, fetchCardsOf} from "./api/UseCaver";
import QRCode from "qrcode.react";
import {useEffect, useState} from "react";
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.css"
import {Alert, CardImg, Card, Container, Image} from "react-bootstrap";
import {MARKET_CONTRACT_ADDRESS} from "./constants";


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000";

function App() {

    const [nfts, setNfts] = useState([]);

    const [myBalance, setMyBalance] = useState("0");

    const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

    const [qrValue, setQrValue] = useState(DEFAULT_QR_CODE);

    useEffect(() => {
        fetchMyNFTs();
    }, [])

    useEffect(() => {
        console.log(nfts);
    }, [nfts]);


    /**
     * 마켓의 NFT들을 가지고옴
     */
    const fetchMarketNFTs = async () => {
        const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);

        setNfts(_nfts);
    }


    /**
     * 본인의 NFT들을 가지고옴
     */
    const fetchMyNFTs = async () => {
        const _nfts = await fetchCardsOf(myAddress);

        setNfts(_nfts);
    }

    /**
     *  자기 주소와 잔고를 가져오는 함수
     * */
    const getUserData = () => {
        KlipAPI.getAddress(setQrValue, async (address) => {
            setMyAddress(address);

            const _balance = await getBalance(address);

            setMyBalance(_balance);
        });
    }

    return (
        <div className="App">
            <div style={{backgroundColor: "black", padding: 10}}>
                <div style={{fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10}}>내지갑</div>
                {myAddress}
                <br/>
                <Alert
                    onClick={getUserData}
                    variant={"balance"} style={{backgroundColor: "#f40075", fontSize: 25}}>
                    {myBalance}
                </Alert>
                <div className={"container"} style={{padding: 0, width: "100%"}}>
                    {nfts.map((nft, index) => (
                        <CardImg key={index} className={"img-responsive"} src={nft.uri}/>
                    ))}
                </div>

            </div>
            <Container style={{backgroundColor: 'white', width: 300, height: 300, padding: 20}}>
                <QRCode value={qrValue} size={256} style={{margin: "auto"}}/>
            </Container>
        </div>
    );
}

export default App;

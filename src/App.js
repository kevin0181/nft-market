import logo from './logo.svg';
import './App.css';
import './market.css';
import {getBalance, fetchCardsOf} from "./api/UseCaver";
import QRCode from "qrcode.react";
import {useEffect, useState} from "react";
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.css"
import {Alert, CardImg, Card, Container, Image, Nav, FormGroup, FormControl, Button, Form} from "react-bootstrap";
import {MARKET_CONTRACT_ADDRESS} from "./constants";
import {mintCardWithURI} from "./api/UseKlip";


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000";

function App() {

    const [nfts, setNfts] = useState([]);

    const [myBalance, setMyBalance] = useState("0");

    const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

    const [qrValue, setQrValue] = useState(DEFAULT_QR_CODE);
    const [tab, setTab] = useState('MARKET');

    const [mintImageUrl, setMintImageUrl] = useState("");

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

    /**
     * NFT 발행
     */
    const onClickMint = (uri) => {
        if (myAddress === DEFAULT_ADDRESS)
            alert("NO ADDRESS");
        const randomTokenId = parseInt(Math.random() * 10000000);
        mintCardWithURI(myAddress, randomTokenId, uri, setQrValue, (result) => {
            alert(JSON.stringify(result));
        })
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

                <Container style={{backgroundColor: 'white', width: 300, height: 300, padding: 20}}>
                    <QRCode value={qrValue} size={256} style={{margin: "auto"}}/>
                </Container>

                {
                    tab === "MARKET" || tab === "WALLET" ? (
                        <div className={"container"} style={{padding: 0, width: "100%"}}>
                            {nfts.map((nft, index) => (
                                <CardImg key={index} className={"img-responsive"} src={nft.uri}/>
                            ))}
                        </div>

                    ) : (
                        <></>
                    )
                }

                {
                    tab === "MINT" ? (
                        <div className={"container"} style={{padding: 0, width: "100%"}}>
                            <Card className={"text-center"}
                                  style={{color: "black", height: "50%", borderColor: "#C5B358"}}>
                                <Card.Body style={{opacity: 0.9, backgroundColor: "black"}}>
                                    {
                                        mintImageUrl !== "" ?
                                            <CardImg src={mintImageUrl} height={"50%"}/> : null
                                    }
                                    <Form>
                                        <FormGroup>
                                            <FormControl
                                                value={mintImageUrl}
                                                onChange={(e) => {
                                                    setMintImageUrl(e.target.value);
                                                }}
                                                type={"text"}
                                                placeholder={"이미지 주소를 입력해주세요."}
                                            />
                                        </FormGroup>
                                        <br/>
                                        <Button
                                            onClick={() => {
                                                onClickMint(mintImageUrl);
                                            }}
                                            variant={"primary"} style={{
                                            backgroundColor: "#810034",
                                            borderColor: "#810034"
                                        }}>발행하기</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <></>
                    )
                }

            </div>
            <nav style={{backgroundColor: "#1b1717", height: 45}} className={"navbar fixed-bottom navbar-light"}
                 role={"navigation"}>
                <Nav className={"w-100"}>
                    <div className={"d-flex flex-row justify-content-around w-100"}>
                        <div onClick={() => {
                            setTab("MARKET");
                            fetchMarketNFTs();
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                MARKET
                            </div>
                        </div>
                        <div onClick={() => {
                            setTab("MINT");
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                MINT
                            </div>
                        </div>
                        <div onClick={() => {
                            setTab("WALLET");
                            fetchMyNFTs();
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                WALLET
                            </div>
                        </div>
                    </div>
                </Nav>
            </nav>
        </div>
    );
}

export default App;

import logo from './logo.svg';
import './App.css';
import './market.css';
import {getBalance, fetchCardsOf} from "./api/UseCaver";
import QRCode from "qrcode.react";
import {useEffect, useState} from "react";
import * as KlipAPI from "./api/UseKlip";
import * as KasAPI from "./api/UseKas";
import "bootstrap/dist/css/bootstrap.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faWallet, faPlus} from "@fortawesome/free-solid-svg-icons";
import {
    Alert,
    CardImg,
    Card,
    Container,
    Image,
    Nav,
    FormGroup,
    FormControl,
    Button,
    Form,
    Modal, ModalHeader, ModalTitle, ModalFooter, Row, Col
} from "react-bootstrap";
import {MARKET_CONTRACT_ADDRESS} from "./constants";
import {buyCard, listingCard, mintCardWithURI} from "./api/UseKlip";


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000";

function App() {

    const [nfts, setNfts] = useState([]);

    const [myBalance, setMyBalance] = useState("0");

    const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

    const [qrValue, setQrValue] = useState(DEFAULT_QR_CODE);
    const [tab, setTab] = useState('MARKET');

    const [mintImageUrl, setMintImageUrl] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [modalProps, setModalProps] = useState({
        title: "Modal",
        onConfirm: () => {
        }
    })

    const [mintTokenID, setMintTokenID] = useState("");

    const rows = nfts.slice(nfts.length / 2);

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
        if (myAddress === DEFAULT_ADDRESS) {
            alert("NO ADDRESS");
            return;
        }
        const _nfts = await fetchCardsOf(myAddress);

        setNfts(_nfts);
    }

    const onClickCard = (id) => {
        if (tab === "WALLET") {
            setModalProps({
                title: "NFT를 마켓에 올리시겠습니까?",
                onConfirm: () => {
                    onClickMyCard(id);
                }
            })
            setShowModal(true)
        }

        if (tab === "MARKET") {
            setModalProps({
                title: "NFT를 구매하시겠습니까?",
                onConfirm: () => {
                    onClickMarketCard(id)
                }
            })
            setShowModal(true)
        }
    }

    const onClickMyCard = (tokenId) => {
        listingCard(myAddress, tokenId, setQrValue, (result) => {
            alert(JSON.stringify(result));
        })

    }

    const onClickMarketCard = (tokenId) => {
        buyCard(tokenId, setQrValue, (result) => {
            alert(JSON.stringify(result));
        })
    }

    /**
     *  자기 주소와 잔고를 가져오는 함수
     * */
    const getUserData = () => {
        setModalProps({
            title: "클립 지갑을 연동하시겠습니까?",
            onConfirm: () => {
                KlipAPI.getAddress(setQrValue, async (address) => {
                    setMyAddress(address);

                    const _balance = await getBalance(address);

                    setMyBalance(_balance);
                });
            }
        })
        setShowModal(true);
    }

    /**
     * NFT 발행
     */
    const onClickMint = async (uri, tokenId) => {
        if (myAddress === DEFAULT_ADDRESS) {
            alert("NO ADDRESS");
            return;
        }

        const metadataURL = await KasAPI.uploadMetaData(uri);
        if(!metadataURL){
            alert("메타 데이터 업로드에 실패하였습니다.");
            return;
        }
        // const randomTokenId = parseInt(Math.random() * 10000000);
        mintCardWithURI(myAddress, tokenId, metadataURL, setQrValue, (result) => {
            alert(JSON.stringify(result));
        })
    }


    useEffect(() => {
        getUserData();
        fetchMarketNFTs();
    }, []);

    return (
        <div className="App">
            <div style={{backgroundColor: "black", padding: 10}}>
                <div style={{fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10}}>내지갑</div>
                {myAddress}
                <br/>
                <Alert
                    onClick={getUserData}
                    variant={"balance"} style={{backgroundColor: "#f40075", fontSize: 25}}>
                    {myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "지갑 연동하기"}
                </Alert>
                {
                    qrValue !== "DEFAULT" ? (
                        <Container style={{backgroundColor: 'white', width: 300, height: 300, padding: 20}}>
                            <QRCode value={qrValue} size={256} style={{margin: "auto"}}/>
                        </Container>) : (<></>)
                }
                <br/>
                {
                    tab === "MARKET" || tab === "WALLET" ? (
                        <div className={"container"} style={{padding: 0, width: "100%"}}>

                            {
                                rows.map((o, rowIndex) => (
                                    <Row key={rowIndex}>
                                        <Col style={{marginRight: 0, paddingRight: 0}}>
                                            <Card onClick={() => {
                                                onClickCard(nfts[rowIndex * 2].id)
                                            }}>
                                                <CardImg src={nfts[rowIndex * 2].uri}/>
                                            </Card>
                                            [{nfts[rowIndex * 2].id}]NFT
                                        </Col>
                                        <Col style={{marginRight: 0, paddingRight: 0}}>
                                            {
                                                nfts.length > rowIndex * 2 + 1 ? (<>
                                                    <Card onClick={() => {
                                                        onClickCard(nfts[rowIndex * 2 + 1].id)
                                                    }}>
                                                        <CardImg src={nfts[rowIndex * 2 + 1].uri}/>
                                                    </Card>
                                                    [{nfts[rowIndex * 2 + 1].id}]NFT
                                                    )
                                                </>) : (<></>)
                                            }

                                        </Col>
                                    </Row>
                                ))
                            }

                            {/*{nfts.map((nft, index) => (*/}
                            {/*    <CardImg onClick={() => {*/}
                            {/*        onClickCard(nft.id)*/}
                            {/*    }} key={index} className={"img-responsive"} src={nft.uri}/>*/}
                            {/*))}*/}
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
                                            <br/>
                                            <FormControl
                                                value={mintTokenID}
                                                onChange={(e) => {
                                                    setMintTokenID(e.target.value);
                                                }}
                                                type={"text"}
                                                placeholder={"토큰 ID를 입력해주세요."}
                                            />
                                        </FormGroup>
                                        <br/>
                                        <Button
                                            onClick={() => {
                                                onClickMint(mintImageUrl, mintTokenID);
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
            <br/>
            <br/>
            <br/>
            <br/>
            <Modal
                size={"sm"}
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
            >
                <ModalHeader style={{border: 0, backgroundColor: "black", opacity: 0.8}}>
                    <ModalTitle>{modalProps.title}</ModalTitle>
                </ModalHeader>
                <ModalFooter style={{border: 0, backgroundColor: "black", opacity: 0.8}}>
                    <Button variant={"secondary"} onClick={() => setShowModal(false)}>닫기</Button>
                    <Button variant={"primary"} onClick={() => {
                        modalProps.onConfirm();
                        setShowModal(false)
                    }} style={{backgroundColor: "#810034", borderColor: "#810034"}}>진행</Button>
                </ModalFooter>
            </Modal>

            <nav style={{backgroundColor: "#1b1717", height: 45}} className={"navbar fixed-bottom navbar-light"}
                 role={"navigation"}>
                <Nav className={"w-100"}>
                    <div className={"d-flex flex-row justify-content-around w-100"}>
                        <div onClick={() => {
                            setTab("MARKET");
                            fetchMarketNFTs();
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                <FontAwesomeIcon color={"white"} size={"lg"} icon={faHome}></FontAwesomeIcon>
                            </div>
                        </div>
                        <div onClick={() => {
                            setTab("MINT");
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                <FontAwesomeIcon color="white" size="lg" icon={faPlus}/>
                            </div>
                        </div>
                        <div onClick={() => {
                            setTab("WALLET");
                            fetchMyNFTs();
                        }} className={"row d-flex flex-column justify-content-center align-items-center"}>
                            <div>
                                <FontAwesomeIcon color="white" size="lg" icon={faWallet}/>
                            </div>
                        </div>
                    </div>
                </Nav>
            </nav>
        </div>
    );
}

export default App;

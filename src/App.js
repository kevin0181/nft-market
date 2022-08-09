import logo from './logo.svg';
import './App.css';
import {readCount, getBalance, setCount} from "./api/UseCaver";
import QRCode from "qrcode.react";
import {useState} from "react";
import * as KlipAPI from "./api/UseKlip";


const DEFAULT_QR_CODE = "DEFAULT";

function App() {

    // readCount();
    // getBalance("0x27b0e5b4d3f72e8f26f4c58a5ee7b04516fb3034");

    const [qrValue, setQrValue] = useState(DEFAULT_QR_CODE);

    const onClickGetAddress = () => { // 클릭시 klip 지갑의 주소를 가져옴
        KlipAPI.getAddress(setQrValue);
    }

    const onClickSetCount = () => {
        KlipAPI.setCount(1054, setQrValue);
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={() => {
                    onClickGetAddress();
                }}>주소 가져오기
                </button>
                <button onClick={() => {
                    onClickSetCount();
                }}>카운트값 변경
                </button>
                <br/>
                <br/>
                <br/>
                <QRCode value={qrValue}/>
                <p>
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;

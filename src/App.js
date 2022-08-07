import logo from './logo.svg';
import './App.css';
import Caver from "caver-js";


// 1 Smart contract 배포 주소 가져오기
// 2 caver.js 이용해서 스마트 컨트랙트 연동하기
// 3 가져온 스마트 컨트렉트 실행 결과 웹에 표현하기

//컨트렉트 주소 0x8983dA5d7f24Cb0314332c038eC6Ee8c1DFF552b (Count.sol)

const COUNT_COUNTRACT_ADRESS = '0x8983dA5d7f24Cb0314332c038eC6Ee8c1DFF552b';
const ACCESS_KEY_ID = "KASKKBBA9XK2CNVHJRXNIVBY" //kas access key
const SECRET_ACCESS_KEY = "q72Y3eh-qIcu-YmylbIvIOu27VNmJzFXgduUg2eJ";
const COUNT_ABI = [{
    "constant": true,
    "inputs": [],
    "name": "count",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getBlockNumber",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_count", "type": "uint256"}],
    "name": "setCount",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}];

const CHAIN_ID = "1001"; //MAINNET 8217 TESTNET 1001

const option = {
    headers: [{
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
    }, {
        name: "x-chain-id",
        value: CHAIN_ID
    }]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option)); //누구한테 가서 실행할지
const CountContract = new caver.contract(COUNT_ABI, COUNT_COUNTRACT_ADRESS); //컨트렉트 주소와 abi를 넣어줌.
const readCount = () => {
    const _count = CountContract.methods.count().call(); // 주소에 가서 count를 실행해줘!
    console.log(_count);
}

const getBalance = (address) => {
    return caver.rpc.klay.getBalance(address).then((res) => {
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));
        console.log('balance : ' + balance);
        return balance;
    })
}

function App() {
    readCount();
    getBalance("0x27b0e5b4d3f72e8f26f4c58a5ee7b04516fb3034");
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
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

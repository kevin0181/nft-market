import logo from './logo.svg';
import './App.css';
import Caver from "caver-js";


// 1 Smart contract 배포 주소 가져오기
// 2 caver.js 이용해서 스마트 컨트랙트 연동하기
// 3 가져온 스마트 컨트렉트 실행 결과 웹에 표현하기

//컨트렉트 주소 0x8983dA5d7f24Cb0314332c038eC6Ee8c1DFF552b (Count.sol)

const COUNT_CONTRACT_ADDRESS = '0x1e8c426B58F6c26BD9A9Bf4E988F7371B87af110'; //contract address
const ACCESS_KEY_ID = "KASKKBBA9XK2CNVHJRXNIVBY" //kas access key
const SECRET_ACCESS_KEY = "q72Y3eh-qIcu-YmylbIvIOu27VNmJzFXgduUg2eJ"; //kas secret access key

// contract abi
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
const CountContract = new caver.contract(COUNT_ABI, COUNT_CONTRACT_ADDRESS); //컨트렉트 주소와 abi를 넣어줌.

const readCount = () => { // contract의 count 메서드를 실행시키는 함수
    const _count = CountContract.methods.count().call(); // 주소에 가서 count를 실행해줘!
    console.log(_count);
}

const getBalance = (address) => { // 주소에 klay가 얼마나 들어있는지 확인하는 함수
    return caver.rpc.klay.getBalance(address).then((res) => {
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));
        console.log('balance : ' + balance);
        return balance;
    })
}

const setCount = async (newCount) => {
    // 사용할 account 설정 key를 통해 지갑설정.
    try {
        const privateKey = "0xd6c51612b9cf9c6c439ae502f892eb18a2b0c5187c623e24743728844d52f4d0"; //여기다가 이렇게 프라이빗키 적으면안댐. 원래는.
        const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
        caver.wallet.add(deployer);
        // 스마트 컨트렉트 실행 트랜잭션 날리기
        // 결과 콘솔로 찍어내기
        const receipt = await CountContract.methods.setCount(newCount).send({
            from: deployer.address,
            gas: "0x4bfd200", // 아무거나 작성해도 되는데, 어차피 setCount 함수를 실행하는 만큼만 가스비가 지출이 된다.   근데 아무거나 라는게 진짜아무거나 작성해도되려나..?
        });
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }

}

function App() {
    readCount();
    getBalance("0x27b0e5b4d3f72e8f26f4c58a5ee7b04516fb3034");
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <button title={'카운트 변경'} onClick={() => {
                    setCount(100)
                }}>카운트 변경
                </button>
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

import Caver from "caver-js";
import CounterABI from "./../abi/CounterABI.json";
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, CHAIN_ID, COUNT_CONTRACT_ADDRESS} from "./../constants";

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
const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS); //컨트렉트 주소와 abi를 넣어줌.

export const readCount = () => { // contract의 count 메서드를 실행시키는 함수
    const _count = CountContract.methods.count().call(); // 주소에 가서 count를 실행해줘!
    console.log(_count);
}

export const getBalance = (address) => { // 주소에 klay가 얼마나 들어있는지 확인하는 함수
    return caver.rpc.klay.getBalance(address).then((res) => {
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));
        console.log('balance : ' + balance);
        return balance;
    })
}

export const setCount = async (newCount) => {
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
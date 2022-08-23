# 멋사에서 하는 NFT 마켓 만들기!

## 시작하기

### `npm start`

# 기능

a. Klip 지갑 주소 가져오기   <br/>
b. Klay 잔고 조회   <br/>
c. NFT 조회(유저, 마켓) <br/>
d. NFT 발행   <br/>
e. NFT 판매(마켓에 올리는거) <br/>
f. NFT 구매   <br/>

# 상호 작용

a. Klip 지갑 주소 가져오기 : Klip API   <br/>
b. Klay 잔고 조회 : a에서 가져온 주소로 caver.js (getBalance)   <br/>
c. NFT 조회(유저, 마켓) : caver.js (특정 주소의 NFT id, uri) <br/>
d. NFT 발행 : Klip API  <br/>
e. NFT 판매(마켓에 올리는거) : Klip API <br/>
f. NFT 구매 : Klip API  <br/>
g. 브라우저에서는 QR, 모바일에서는 바로 카카오톡 Klip 지갑 앱으로 연동
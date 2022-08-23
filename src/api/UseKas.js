import axios from "axios";
import {ACCESS_KEY_ID, CHAIN_ID, SECRET_ACCESS_KEY} from "../constants";


export const uploadMetaData = async (imageUrl) => {
    const _description = "루니야 아프지마라!! 오래오래 보자!";
    const _name = "우리 루니♡";

    const option = {
        headers: {
            Authorization: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
            "x-chain-id": CHAIN_ID,
            "content-type": "application/json"
        }
    }

    const metaData = {
        metadata: {
            name: _name,
            description: _description,
            image: imageUrl
        }
    }


    try {
        const response = await axios.post("https://metadata-api.klaytnapi.com/v1/metadata", metaData, option);

        console.log(response.data);
        return response.data.uri
    } catch (e) {
        throw new Error(e);
        return false;
    }
}
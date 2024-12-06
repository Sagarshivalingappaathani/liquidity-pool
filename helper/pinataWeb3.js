import { PinataSDK } from "pinata-web3";

const pinataWeb3 = new PinataSDK({
	pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
	pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});


export default pinataWeb3;


//diq916hSvMwjpETGcPkjH4nulN1GHEaRy6CinINywY2-VnJEJGT_f_6rU-eLbgCN

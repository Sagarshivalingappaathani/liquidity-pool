import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
	pinataJwt: `${process.env.NEXT_PUBLIC_PINATA_JWT}`,
	pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export default pinata;

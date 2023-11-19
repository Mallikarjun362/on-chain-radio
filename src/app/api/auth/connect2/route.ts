import { UserModel } from "@/mongodb_models";
import nacl from "tweetnacl";
import { NextRequest, NextResponse } from "next/server"
import { NOUNCE } from "@/utils/3_Constants";
import { generateJwtToken } from "@/utils/2_Authentication";


export const POST = async (req: NextRequest, res: NextResponse) => {
    const { wallet_address, signature } = await req.json();
    const the_user = await UserModel.findOne({ wallet_address }).exec();
    const { nounce_message, public_key } = the_user;
    const full_message = `APTOS\nmessage: ${nounce_message}\nnonce: ${NOUNCE}`;

    const verified = nacl.sign.detached.verify(
        Buffer.from(full_message),
        Buffer.from(signature, 'hex'),
        Buffer.from(public_key.slice(2, 66), 'hex'),
    );

    if (verified) {
        return NextResponse.json({ jwt_auth_token: generateJwtToken({ wallet_address }) });
    } else {
        return NextResponse.json({ message: "Failed Verification", jet_auth_token: null });
    }

}
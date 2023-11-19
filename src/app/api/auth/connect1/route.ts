import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from "next/server"
import { UserModel } from '@/mongodb_models';

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { wallet_address, public_key } = await req.json();
    const the_user = await UserModel.findOne({ wallet_address });
    const nounce_message = uuidv4();

    if (the_user) {
        // --------- USER EXISTS ---------
        the_user.nounce_message = nounce_message;
        await the_user.save()
        const response = NextResponse.json({ nounce_message })
        return the_user ? response : response;
    } else {
        // --------- USER NOT EXISTS ---------
        const new_user = new UserModel({
            wallet_address,
            nounce_message,
            public_key,
        });
        await new_user.save();
        return NextResponse.json({ nounce_message });
    }
}
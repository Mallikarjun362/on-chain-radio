import { NextResponse } from "next/server"
export const GET = async (req: Request, res: Response) => {
    return NextResponse.json({ message: "Hello World" });
}
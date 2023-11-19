import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("MIDDLEWARE:",request.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ['/([a-z]*)'],
}
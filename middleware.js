import { NextResponse, NextRequest } from 'next/server';
const jose = require('jose');

//jose requires Uint8Array instance as secret
const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export default async function middleware(request) {
  //Middleware runs for API requests too, but cookies might not be deleted until the end
  const response = NextResponse.next();
  const hasJwt = request.cookies.get('token');
  if (!hasJwt) {
    //return NextResponse.rewrite(new URL('/forum/landing', request.url));
    return response;
  }
  const jwt = request.cookies.get('token').value;
  try {
    await jose.jwtVerify(jwt, secret);
  } catch (err) {
    console.error(err);
    response.cookies.delete('token');
    console.log('Error verifying jwt!');
    console.log(response.cookies);
    //return NextResponse.rewrite(new URL('/forum/landing', request.url));
    return response;
  }
  //const url = request.url;
  // if (url.endsWith('/forum/new_post')) {

  // }
}

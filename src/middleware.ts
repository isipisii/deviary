import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"
// import { getServerSideSession } from "./lib/auth"

// using with auth from next auth
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/feed", req.url))
      }
      return null
    }

    if (!isAuth) {
      return NextResponse.redirect(
        new URL("/sign-in", req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

// using server session
// export async function middleware(request: NextRequest) {
//   const session = await getServerSideSession()
//   const isAuthenticated = !!session?.user
//   const isInAuthPage = request.nextUrl.pathname.startsWith("/sign-in") || request.nextUrl.pathname.startsWith("/sign-up")
  
//   if(isAuthenticated && isInAuthPage) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   return NextResponse.redirect(new URL('/sign-in', request.url))

// }
 
export const config = {
  // these are the paths where the middleware will run
  matcher: ["/", "/sign-in", "/sign-up", "/guild", "/onboarding", "/feed"]
}

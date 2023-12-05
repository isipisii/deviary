import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

// using with auth from next auth
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuthenticated = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") ||  req.nextUrl.pathname.startsWith("/sign-up") || req.nextUrl.pathname === "/"
    const isOnboardingPage =  req.nextUrl.pathname.startsWith("/onboarding")

    if (isAuthPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/feed", req.url))
      }
      return null
    }

    //redirects the user to feed if the current page is onboarding and the user's onboarded status is true
    if(isOnboardingPage && isAuthenticated) {
        if(token?.onboarded) return NextResponse.redirect(new URL("/feed", req.url))
        return null
    }
    
     //otherwise, redirect the user to onboarding page
    if(!isOnboardingPage && isAuthenticated) {
      if(!token?.onboarded) return NextResponse.redirect(new URL("/onboarding", req.url))
      return null
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/sign-in", req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // returns true so that the middlewaree fn above is always called
        return true
      },
    },
  }
)
 
export const config = {
  // these are the paths where the middleware will run
  matcher: ["/", "/sign-in", "/sign-up", "/guild", "/onboarding", "/feed"]
}

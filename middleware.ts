// middleware.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getFirebaseAuth } from "next-firebase-auth-edge/lib/auth"
import {
  authentication,
  refreshAuthCookies,
} from "next-firebase-auth-edge/lib/next/middleware"

import { authConfig } from "@/config/server-config"

const { setCustomUserClaims, getUser } = getFirebaseAuth(
  authConfig.serviceAccount,
  authConfig.apiKey
)

const PUBLIC_PATHS = ["/register", "/login", "/reset-password"]

const commonOptions = {
  apiKey: "firebase-api-key",
  cookieName: "AuthToken",
  cookieSignatureKeys: ["secret1", "secret2"],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: false, // Set this to true on HTTPS environments
    sameSite: "strict" as const,
    maxAge: 12 * 60 * 60 * 24, // twelve days
  },
  serviceAccount: {
    projectId: "firebase-project-id",
    privateKey: "firebase service account private key",
    clientEmail: "firebase service account client email",
  },
}

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/"
  url.search = ""
  return NextResponse.redirect(url)
}

function redirectToLogin(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  return authentication(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",

    handleValidToken: async ({ token, decodedToken }) => {
      if (request.nextUrl.pathname === "/api/custom-claims") {
        await setCustomUserClaims(decodedToken.uid, {
          someClaims: ["someValue"], //TODO: add custom claims here
        })

        const user = await getUser(decodedToken.uid)

        const response = new NextResponse(JSON.stringify(user.customClaims), {
          status: 200,
          headers: { "content-type": "application/json" },
        })

        await refreshAuthCookies(token, response, commonOptions)
        return response
      }
      // Authenticated user should not be able to access /login, /register and /reset-password routes
      else if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request)
      }
      // Use custom claims to check if user is strictly admin
      else if (
        request.nextUrl.pathname.startsWith("/admin") &&
        !decodedToken.someClaims.includes("admin")
      ) {
        return redirectToHome(request)
      }

      return NextResponse.next()
    },
    handleInvalidToken: async () => {
      return redirectToLogin(request)
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error })
      return redirectToLogin(request)
    },
    ...commonOptions,
  })
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
  ],
}

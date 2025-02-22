const AUTH_URL = "https://api.basic.tech/auth/token"

let bearerToken: string | null = null
let tokenExpiry: number | null = null

export const fetchBearerToken = async (authCode: string) => {
  if (bearerToken && tokenExpiry && Date.now() < tokenExpiry) {
    return bearerToken // Return cached token if valid
  }

  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: authCode, // Pass dynamic AUTHORIZATION_CODE
      }),
    })

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.statusText}`)
    }

    const data = await response.json()
    bearerToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000 // Cache token expiration

    return bearerToken
  } catch (error) {
    console.error("Failed to get bearer token:", error)
    throw new Error("Authentication failed")
  }
}

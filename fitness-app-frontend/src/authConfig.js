export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173', // Remove trailing slash
  scope: 'openid profile email', // Removed 'someScope' and 'offline_access' for now
  onRefreshTokenExpire: (event) => event.logIn(),
}
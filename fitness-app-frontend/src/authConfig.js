export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173/',
  scope: 'someScope openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
}

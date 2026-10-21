// ============================================================
//  Configuration de l'API — developpement
//  En dev, les appels /api sont relayes vers Spring Boot
//  par le proxy (proxy.conf.json). Aucune URL absolue ici.
// ============================================================
export const environment = {
  production: false,
  apiBaseUrl: '/api',
};

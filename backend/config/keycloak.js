import Keycloak from 'keycloak-connect';
import session from 'express-session';

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak(
  {
    store: memoryStore,
  },
  {
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_SERVER_URL,
    realm: process.env.KEYCLOAK_REALM,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
  }
);

export { keycloak, memoryStore };

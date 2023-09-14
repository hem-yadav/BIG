import { Client, ClientOptions, AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { scopes, credentials } from '../config/azureConfig';

class Graph {
    private client: Client;

    constructor(authProvider: AuthenticationProvider, options: ClientOptions) {
        this.client = Client.initWithMiddleware({
            authProvider,
            ...options,
        });
    }

    api(endpoint: string) {
        return this.client.api(endpoint);
    }

    async getUserInfo(userId: string) {
        try {
            const user = await this.client.api(`/users/${userId}`).get();
            return user;
        } catch (error) {
            console.error("Error fetching user information:", error);
            throw error;
        }
    }
}

const clientId = credentials.CLIENT_ID ;
const tenantId = credentials.TENANT_ID ;
const clientSecret = credentials.CLIENT_SECRET;

const tokenCredential = new ClientSecretCredential(tenantId!, clientId!, clientSecret!);

const authProvider = new TokenCredentialAuthenticationProvider(tokenCredential, {
    scopes: [scopes],
});

const clientOptions: ClientOptions = {
    debugLogging: true,
    authProvider,
};

const graph = new Graph(authProvider, clientOptions);

export default graph;

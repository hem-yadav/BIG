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

    // Add any custom methods or properties you need
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

console.log('ClientId:', clientId); // Add this line
console.log('TenantId:', tenantId); // Add this line
console.log('ClientSecret:', clientSecret); // Add this line

// Create an instance of the TokenCredential class that is imported
const tokenCredential = new ClientSecretCredential(tenantId!, clientId!, clientSecret!);

const authProvider = new TokenCredentialAuthenticationProvider(tokenCredential, {
    scopes: [scopes],
});

// Initialize the Graph API client
const clientOptions: ClientOptions = {
    debugLogging: true,
    authProvider,
};

const graph = new Graph(authProvider, clientOptions);

export default graph;

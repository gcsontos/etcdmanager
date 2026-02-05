import {
    Etcd3,
    IOptions,
} from 'etcd3';
import { toBuffer } from '@/lib/buffer-utils';

export default class EtcdService {
    protected client: any = null;

    constructor(client?: Etcd3) {
        if (client) {
            this.client = client;
        }
    }

    public getClient(): Etcd3 {
        return this.client;
    }

    public async isConnectionAvailable() {
        // Use maintenance API to verify connection
        return this.client.maintenance.status();
    }

    public init(options?: IOptions): EtcdService | string {
        if (this.client) {
            this.client.close();
        }

        // Ensure credentials are proper Buffers with content
        let finalOptions = options;
        if (finalOptions?.credentials) {
            // Convert and validate credentials, rebuilding the object with only valid buffers
            const rootCert = finalOptions.credentials.rootCertificate
                ? toBuffer(finalOptions.credentials.rootCertificate)
                : null;
            const privateKey = finalOptions.credentials.privateKey
                ? toBuffer(finalOptions.credentials.privateKey)
                : null;
            const certChain = finalOptions.credentials.certChain
                ? toBuffer(finalOptions.credentials.certChain)
                : null;

            if (rootCert && rootCert.length > 0) {
                // Rebuild credentials with only valid buffers
                const newCredentials: { rootCertificate: Buffer; privateKey?: Buffer; certChain?: Buffer } = {
                    rootCertificate: rootCert,
                };
                if (privateKey && privateKey.length > 0) {
                    newCredentials.privateKey = privateKey;
                }
                if (certChain && certChain.length > 0) {
                    newCredentials.certChain = certChain;
                }
                finalOptions = { ...finalOptions, credentials: newCredentials };
            } else {
                // No valid root certificate, remove credentials entirely
                const { credentials: _, ...optionsWithoutCredentials } = finalOptions;
                finalOptions = optionsWithoutCredentials as IOptions;
            }
        }

        this.client = new Etcd3(finalOptions);
        return this;
    }
}

import {
    Etcd3, ILeaseTimeToLiveResponse, ILeaseRevokeResponse,
} from 'etcd3';
import Long from 'long';
import { GenericObject } from '../../types/index';
import EtcdService from './etcd.service';

export default class LeaseService extends EtcdService {
    constructor(client?: Etcd3) {
        super(client);
    }

    public async getLeases(): Promise<GenericObject[]> {
        const res = await this.client.leaseClient.leaseLeases();
        return Promise.resolve(res.leases.map((lease: any) => ({ ID: lease.ID })));
    }

    public async loadLease(leaseId: string): Promise<ILeaseTimeToLiveResponse> {
        try {
            // Use Long for proper int64 serialization
            const res = await this.client.leaseClient.leaseTimeToLive({
                ID: Long.fromString(String(leaseId)),
                keys: true,
            });
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public async purge(): Promise<ILeaseRevokeResponse[]> {
        try {
            const leases = await this.getLeases();
            const promises: Promise<ILeaseRevokeResponse>[] = [];
            leases.forEach((lease) => {
                promises.push(this.client.leaseClient.leaseRevoke({
                    ID: Long.fromString(lease.ID),
                }));
            });
            return Promise.all(promises);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public remove(leaseIds: string[]): Promise<ILeaseRevokeResponse[]> {
        const promises: Promise<ILeaseRevokeResponse>[] = [];
        leaseIds.forEach((leaseId) => {
            promises.push(this.client.leaseClient.leaseRevoke({
                ID: Long.fromString(leaseId),
            }));
        });
        return Promise.all(promises);
    }
}

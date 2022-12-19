import type { PrismClient } from "#lib/PrismClient";

export class PrismClientUtil {
    constructor(client: PrismClient) {
        this.client = client;
    }
}

export interface PrismClientUtil {
    client: PrismClient;
}
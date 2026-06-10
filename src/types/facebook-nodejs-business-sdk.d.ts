/**
 * O SDK oficial `facebook-nodejs-business-sdk` não publica tipos.
 * Declaramos aqui apenas a superfície que o MetaAdsAdapter usa.
 */
declare module 'facebook-nodejs-business-sdk' {
  export class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi;
  }

  export class Ad {
    constructor(id: string, parentId?: string);
    update(fields: string[], params: Record<string, unknown>): Promise<unknown>;
  }
}

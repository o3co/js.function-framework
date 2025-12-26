import type { Factory as StorageFactory } from "@o3co/js.util.storage/Factory.d.mts";
import type { Client, ClientParams } from "./bases/Base.mts";

interface ClientDefinition {
  classPath?: string;
}

interface ConstructorParams {
  clients: Record<string, ClientDefinition>;
  storageFactory: StorageFactory;
}

/**
 * Factory class for creating client instances
 */
export class Factory {
  private params: ConstructorParams;

  constructor(params: ConstructorParams) {
    this.params = params;
  }

  /**
   * クライアントを生成
   */
  async create(name: string): Promise<Client<ClientParams>> {
    const {
      storageFactory,
      clients: { [name]: params = {} },
    } = this.params;

    const { Client } = await import(
      params?.classPath ?? `./${String(name)}.mjs`
    );

    return new Client({
      ...params,
      storageFactory,
    });
  }
}

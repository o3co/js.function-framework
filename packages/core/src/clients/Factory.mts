import path from "node:path";
import type { Factory as StorageFactory } from "@o3co/js.util.storage/Factory.d.mts";
import type { Client, ClientParams } from "./Base.mts";

interface ClientDefinition {
  classPath?: string;
}

interface ConstructorParams {
  pathResolver?: (string) => string;
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
      pathResolver = import.meta.resolve,
    } = this.params;

    if (process.env.npm_package_name) {
      const { Client: Component } = await import(
        pathResolver(
          params.classPath ??
            path.join(
              ...[
                process.env.npm_package_name,
                "clients",
                `${name}.mjs`,
              ].filter((v) => v),
            ),
        )
      );
      return new Component({
        ...params,
        storageFactory,
      });
    }

    throw new Error(`Unspecified PackageManager: cannot resolve components`);
  }
}

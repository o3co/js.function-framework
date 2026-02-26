import path from "node:path";
import type { Factory as StorageFactory } from "@o3co/js.util.storage/Factory.d.mts";

interface ClientDefinition {
  classPath?: string;
}

interface ConstructorParams {
  pathResolver?: (string) => string;
  clients: Record<string, ClientDefinition>;
  storageFactory: StorageFactory;
  autoloadPkg?: string;
}

/**
 * Factory class for creating client instances
 */
export class Factory {
  private params: ConstructorParams;

  private autoloadPkg: string | undefined;

  constructor(params: ConstructorParams) {
    this.params = params;
    this.autoloadPkg = params.autoloadPkg ?? process.env.npm_package_name;
  }

  /**
   * クライアントを生成
   */
  async create<TClient>(name: string): Promise<TClient> {
    const {
      storageFactory,
      clients: { [name]: params = {} },
      pathResolver = import.meta.resolve,
    } = this.params;

    if (this.autoloadPkg) {
      try {
        const { Client: Component } = await import(
          pathResolver(
            params.classPath ??
              path.join(
                ...[this.autoloadPkg, "clients", `${name}.mjs`].filter(
                  (v) => v,
                ),
              ),
          )
        );
        return new Component({
          ...params,
          storageFactory,
        }) as TClient;
      } catch (cause) {
        throw new Error(`Failed to import client`, { cause });
      }
    }

    throw new Error(`Unspecified PackageManager: cannot resolve components`);
  }
}

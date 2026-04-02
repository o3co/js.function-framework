import { resolveModulePath } from "@o3co/js.function-framework.core/Helpers.mjs";
import type { Client, ClientFactory as IClientFactory } from "../interfaces.mjs";
import type { ClientConfig } from "../config/schema.mjs";

export type ConstructorParams = {
  pathResolver?: (path: string) => string;
  clients: Record<string, ClientConfig>;
  storageFactory?: unknown;
  autoloadPkg?: string;
};

/**
 * Factory class for creating client instances
 */
export class Factory implements IClientFactory {
  private params: ConstructorParams;
  private autoloadPkg: string | undefined;

  constructor(params: ConstructorParams) {
    this.params = params;
    this.autoloadPkg = params.autoloadPkg ?? process.env.npm_package_name;
  }

  async create<TClient extends Client>(name: string): Promise<TClient> {
    const {
      storageFactory,
      clients: { [name]: clientDef = {} },
      pathResolver = import.meta.resolve,
    } = this.params;

    if (this.autoloadPkg) {
      try {
        const { Client: Component } = await import(
          clientDef.classPath
            ? pathResolver(clientDef.classPath)
            : resolveModulePath(pathResolver, this.autoloadPkg, "clients", name)
        );
        return new Component({
          ...clientDef,
          storageFactory,
        }) as TClient;
      } catch (cause) {
        throw new Error(`Failed to import client "${name}"`, { cause });
      }
    }

    throw new Error(`Unspecified PackageManager: cannot resolve components`);
  }
}

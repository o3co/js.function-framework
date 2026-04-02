import path from "node:path";

export * as ObjectHelper from "@o3co/js.util.misc/types/object/index.mjs";
export * as StringHelper from "@o3co/js.util.misc/types/string/index.mjs";

export function resolveModulePath(
  pathResolver: (p: string) => string,
  autoloadPkg: string | undefined,
  category: string,
  name: string,
): string {
  return pathResolver(
    path.posix.join(
      ...[autoloadPkg, category, `${name}.mjs`].filter((v): v is string => v != null),
    ),
  );
}



```yaml

commands:
  MyCommand:
    # Optional
    # if not specified, then `commands/${name}.mjs` will replaced
    # if import file failed, then fallback to SingleTaskCommand.mjs
    # classPath: @scope/myPackage/commands/MyCommand.mjs

    # Optional:
    # Default: "pass"
    # Description: type of representer.
    # DefaultSupports:
    #   - "json" 
    #   - "pass" 
    representer: pass 

    # Required
    # Description: name of process execute via command
    process: nameOfProcess

    params:
      ...
      # Any params pass to constructor
```

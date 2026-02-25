

```yaml


commands:
  # Command Def is optional.
  # if not existed, then it will be created as SingleTaskCommand
  MySimpleCommand:
    ## type
    ## Optional
    ## Command type or classPath
    ## if not specified, then `commands/${name}.mjs` will replaced
    ## if import file failed, then fallback to SingleTaskCommand.mjs
    ## 
    ## Default supports
    ##   - SingleTask: For simple single task
    ##   - SequentialTasks: For sequential tasks
    ##   - ParallelTasks: For parallel tasks
    #type: SingleTask
    #type: @scope/myPackage/commands/MyCommand.mjs

    ## response
    ## Optional
    ## response representer name or config
    ## Default: "pass"
    ## defualt type support:
    ##   - "json" 
    ##   - "pass" 
    #response: pass 
    ## or
    #response:
    #    type: pass
    #    ...params to create representer

    # Required for SingleTask
    # Description: name of process execute via command
    process: MyProcessName
  MySingleTaskCommand:
    type: SingleTask
    # params
    # Optional
    # Default process run params
    # This might be useful if use same process for different command.
    # Ex) ResizeSmallImage and ResizeLargeImage
    params:
      ...
      # Any params pass to command constructor
  MySequentialCommand:
    type: SequentialTasks
    processes:
      - process: FirstProcess
        #params:
      - process: SecondProcess
        #params:
        #   xxx: xxxx
  MyParalleTaskCommand:
    type: ParallelTaskCommands
    processes:
      - process: FirstProcess
        params:
          key: value
      - process: SecondProcess
        params:
          key: value
  MyPredefTaskCommand:
    type: PredefTasks
    asyncMode:
    processes:

```

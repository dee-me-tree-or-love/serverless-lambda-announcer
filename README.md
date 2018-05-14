# serverless-lambda-announcer :speech_balloon: 
A plugin for serverless framework that announces a deploy of a new function to a given url. 

## Purpose  
This plugin allows to specify a custom hook listening for lambda deploys.  
On deploy the announcer will announce the lambda definition to the specified hook.  
The hook should be a `POST` endpoint accepting json-encoded payload.   
## Installation  
Run `npm install serverless-lambda-announcer`  
Add it to the `serverless.yml` as:  
```
plugins:
  ...
  - serverless-lambda-announcer
  ...
```  
## Usage  
This plugin announces only *full* deployments: fired on `sls deploy` only :v:  
### Configuration  
In the `serverless.yml` specify a custom parameter for the announcer:  
```yaml
custom:
  # can be specified as an array attribute too: - announcer:
  announcer:
    # required:
    hook: <your POST webhook>
    # optional:
    contract:   
      /{function name}: <your contract> 
```     
**Hook**:  
The `hook` must be an accessible `POST` url accepting json input.   
    
**Contract**:  
The `contract` is an optional paramter. 
If specified must be mapped to function name.
Can be specified in any form. 
It will be passed along in the body same way as was specified.   
  
### Announce Body
The body that is sent from the announcer is:  
```
[
  {
    "endpoints": [
      {
        "method": <http method>,
        "path": <full https endpoint>
      }
    ],
    "name": "<service name> : <function name>",
    "identifier": <function name>,
    "events":[
      {<generated cloudformation event data>}
    ],
    "contract": <your specified contract (if exists)>
  }  
]
```  
## Kudos  
Some methods are borrowed from the sourcecode of the [`serverless`](https://github.com/serverless/serverless) core plugins - super-duper-mega thanks  

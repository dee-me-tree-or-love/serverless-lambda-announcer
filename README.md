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
In the `serverless.yml` specify a custom parameter for the announcer:  
```
custom:
  - announcer:
      hook: <your POST webhook>
```    
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
    "name":"<service name> : <function name>",
    "events":[
      {<generated cloudformation event data>}
    ]
  }  
]
```  

const AWS = require('aws-sdk'); 
const stepfunctions = new AWS.StepFunctions();
const {SUCCESS, FAILURE} = require('../shared/constants').approval


const BAD_REQUEST = {
    statusCode: 400,
    body: "Bad request"
}

module.exports.handler = async(event) =>{
    console.log(event)
    
    const {outcome} = event.pathParameters
    const {taskToken} = event.queryStringParameters

    console.log(`Running with outcome: ${outcome}, taskToken: ${taskToken}`)
    
    switch(outcome){
        case FAILURE:
            await stepfunctions.sendTaskFailure(taskFailureParams(taskToken)).promise();
            break;
        case SUCCESS:
            await stepfunctions.sendTaskSuccess(taskSuccessParams(taskToken)).promise();
            break;
        default:
            return BAD_REQUEST;
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Manual approval completed"
        })
    }
}

const taskFailureParams = (taskToken)=> {
    return {
                "cause": "Reject link was clicked.",
                "error": "Rejected",
                taskToken
    }
}

const taskSuccessParams = (taskToken)=> {
    return {
                output: JSON.stringify({
                    message: "Approve link was clicked"                         
                }),
                taskToken
    }
}
const AWS = require('aws-sdk'); 
const stepfunctions = new AWS.StepFunctions();
const {SUCCESS, FAILURE} = require('../shared/constants.js').approval

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
            await stepfunctions.sendTaskSuccess(rejectParams(taskToken)).promise();
            break;
        case SUCCESS:
            await stepfunctions.sendTaskSuccess(approveParams(taskToken)).promise();
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

const approveParams = (taskToken)=> {
    return taskSucessParams(taskToken, 
    {status: "Success" ,
    message: "Approved!"})
}

const rejectParams = (taskToken)=> {
    return taskSucessParams(taskToken, {status: "Failure" ,
    message: "Rejected!"})
}


const taskSucessParams = (taskToken, output) => {
    return {
        output: JSON.stringify(output),
        taskToken
    }
}
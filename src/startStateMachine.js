const AWS = require('aws-sdk'); 
const stepFunctions = new AWS.StepFunctions();

module.exports.handler = async (event, context) => {

    const executionParams = {
      stateMachineArn: process.env.STATE_MACHINE_ARN,      
      input: event.body
    };

    let data = await stepFunctions
      .startExecution(executionParams)
      .promise();      

    return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Started the step function. View the scheduled step function in aws console.',
          data  
        })
    }

  }
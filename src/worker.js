const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk'); 
const {SUCCESS, FAILURE} = require('../shared/constants').approval
const stepfunctions = new AWS.StepFunctions();
const ses = new AWS.SES();

module.exports.handler = async(event,context) =>{


    console.log(process.env)
    
    var taskParams = {
        activityArn: process.env.activityArn,
        workerName: "pepe"
    };

    try{

        let data = await stepfunctions.getActivityTask(taskParams).promise();

        if (!data.input) {
            // No activities scheduled
            console.log('No activities received after 60 seconds.');
        } else {
            console.log("data: "+ JSON.stringify(data))
            
            var input  = JSON.parse(data.input);

            var emailParams = {
                Destination: {
                    ToAddresses: [
                        input.managerEmailAddress
                        ]
                },
                Message: {
                    Subject: {
                        Data: 'Your Approval Needed for Promotion!',
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Html: {
                            Data: `Hi!<br /> ${input.employeeName} has been nominated for promotion!<br />
                                Can you please approve:<br />
                                ${process.env.GW_URL}/approval/${SUCCESS}?taskToken=${encodeURIComponent(data.taskToken)}<br />
                                Or reject:<br />
                                ${process.env.GW_URL}/approval/${FAILURE}?taskToken=${encodeURIComponent(data.taskToken)}`,
                            Charset: 'UTF-8'
                        }
                    }
                },
                Source: input.managerEmailAddress,
                ReplyToAddresses: [
                        input.managerEmailAddress
                    ]
            };
            
            
            let dataEmail = await ses.sendEmail(emailParams).promise()
                        
        }    
    }catch(error){
        console.log('An error occured ' + error);
    }
    
}


const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");

// Configure AWS SDK with your credentials and region
const ssm = new SSMClient({ region: 'us-east-1' });

const appId = 'd8swtsenicj2o'

const copyFromEnv = 'staging'


// Define parameters with their paths and values
const parameters = [
    "AMPLIFY_function_AuditHoltercases_reportFromEmail",
    "AMPLIFY_function_BillingMonitor_defaultCardiologistId"
];

const newParameters = [];

const getAmplifyParams = async () => {
    const fs = require("fs");
    var response = JSON.parse(fs.readFileSync(0, { encoding: "utf8" }));
    return response;
  };
  

// Function to check if parameters exist in SSM Parameter Store
async function checkIfParamsExist(envName) {
  try {
    // Check if the first parameter already exists
    const firstParameterPath = `/amplify/${appId}/${envName}/${parameters[0]}`;
    const command = new GetParameterCommand({ Name: firstParameterPath, WithDecryption: true});
    const existingFirstParameter = await ssm.send(command);
    return existingFirstParameter.Parameter ? existingFirstParameter.Parameter.Value : null;
} catch (error) {
  console.log('Error checking parameters:', error);
  return null;
}
}

async function getOtherEnvParams(copyFromEnv) {
  try {
      // Loop through the parameter list and fetch each parameter
      for (const parameter of parameters) {
       
          const parameterPath = `/amplify/${appId}/${copyFromEnv}/${parameter}`;
          try {
            const command = new GetParametersCommand({ Name: parameterPath, WithDecryption: true });
            const existingParameter = await ssm.send(command);
            if (existingParameter)
            {
              newParameters.push({
                name: existingParameter.Parameter.Name.split('/')[4],
                value: existingParameter.Parameter.Value,
                type: existingParameter.Parameter.Type
            });
            } else {
              console.log(`Parameter not found: ${parameterPath}`);
              // Optionally, you can continue to the next iteration of the loop
              continue;
          }
          } catch (parameterNotFoundError) {
            // Handle the case where the parameter does not exist
            console.log(`Parameter not found: ${parameterPath}`);
            // Optionally, you can continue to the next iteration of the loop
            continue;
        }
      }

      // Now 'newParameters' array contains all parameters in the specified format
      console.log(newParameters);
      return newParameters;
  } catch (error) {
      console.log('Error retrieving parameters:', error);
      throw error;
  }
}

// async function getOtherEnvParams() {
//     try {
//         // Loop through the parameter list and fetch each parameter
//         for (const parameter of parameters) {
         
//             const parameterPath = `/amplify/${appId}/${copyFromEnv}/${parameter}`;
//             console.log('parameterPath:', parameterPath);
//             const command = new GetParametersCommand({ Name: parameterPath, WithDecryption: true });
//             const existingParameter = await ssm.send(command);
//             // Save parameter details to the newParameters array
//             newParameters.push({
//                 name: existingParameter.Parameter.Name.split('/')[4],
//                 value: existingParameter.Parameter.Value,
//                 type: existingParameter.Parameter.Type
//             });
//         }

//         // Now 'newParameters' array contains all parameters in the specified format
//         console.log(newParameters);
//         return newParameters;
//     } catch (error) {
//         console.error('Error retrieving parameters:', error);
//         throw error;
//     }
// }

// Function to create parameters in SSM Parameter Store
async function createParameters(envName) {
    console.log("Creating:")
  try {
    for (const parameter of newParameters) {
      const parameterPath = `/amplify/${appId}/${envName}/${parameter.name}`;
      console.log(`Ccreating:${parameterPath}`)
      const params = {
        Name: parameterPath,
        Value: parameter.value,
        Type: parameter.type,
        Overwrite: true,
      };

      var command = new PutParameterCommand(params);
      await ssm.send(command);
      console.log(`Parameter created: ${params.Name}`);
    }

    console.log('All parameters created successfully.');
  } catch (error) {
    console.log('Error creating parameters:', error);
  }
}

// Main function to control the flow
async function main() {
  try {
    // Get Amplify environment
    const amplifyParams = await getAmplifyParams();
    console.log('amplifyParams.data.amplify.argv[4]:', amplifyParams.data.amplify.argv[4]);
   // const envName = amplifyParams.data.amplify.argv[4]["envName"];
   const parsedParams = JSON.parse(amplifyParams.data.amplify.argv[4]);
   console.log('parsedParams.envName ', parsedParams.envName);
   const envName = parsedParams.envName;
    // Check if parameters exist
    console.log("Checking if param exists:")
    const paramsExist = await checkIfParamsExist(envName);

    if (!paramsExist) {
      // If parameters do not exist, create them
      console.log("not exist")
      await getOtherEnvParams(); 
      await createParameters(envName);
    } else {
      console.log(`First parameter already exists. Exiting script.`);
    }
  } catch (err) {
    console.log("error")
    console.log(err);
    process.exitCode = 1;
  }
}

// Call the main function
main();
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Auth } from "aws-amplify";
import config from "../../amplify.config";

// let idToken = getToken();
let COGNITO_ID =
  "cognito-idp.ap-southeast-2.amazonaws.com/" + config.Auth.userPoolId; // 'COGNITO_ID' has the format 'cognitoidp.REGION.amazonaws.com/COGNITO_USER_POOL_ID'

const client = new CloudWatchClient({
  region: "ap-southeast-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "ap-southeast-2" }),
    identityPoolId: config.Auth.identityPoolId,
  }),
});

export default async function metricToCloudwatch(
  dimName,
  metric,
  dimValue,
  value,
  unit
) {
  const {
    accessToken: { jwtToken, payload },
  } = await Auth.currentSession();

  let loginData = {
    [COGNITO_ID]: jwtToken,
  };

  const creds = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "ap-southeast-2" }),
    identityPoolId: config.Auth.identityPoolId,
    logins: {
      loginData,
    },
  });

  client.config.credentials = creds;

  const { client_id, sub, username, event_id } = payload;

  const MetricData = [
    {
      MetricName: metric ? metric : "DefaultMetric" /* required */,
      Dimensions: [
        {
          Name: dimName ? dimName : "dimension_name_test" /* required */,
          Value: dimValue ? dimValue : "dimenstion_value_test" /* required */,
        },
        /* more items */
      ],
      Timestamp: new Date(),
      Unit: unit ? unit : "Count/Second",
      Value: value,
    },
    /* more items */
  ];

  const putMetricDataCommandParams = {
    Namespace: "FixPDQWebApp",
    MetricData,
  };

  const putMetricData = new PutMetricDataCommand(putMetricDataCommandParams);

  client
    .send(putMetricData)
    .then((putMetric) => {
      // console.log('putMetric:', putMetric);
    })
    .catch((error) => {
      console.error("putMetric error:", error);
    });
}

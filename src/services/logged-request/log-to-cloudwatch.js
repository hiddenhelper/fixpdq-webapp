import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Auth } from "aws-amplify";
import Bottleneck from "bottleneck";
import config from "../../amplify.config";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000,
});

// let idToken = getToken();
let COGNITO_ID =
  "cognito-idp.ap-southeast-2.amazonaws.com/" + config.Auth.userPoolId; // 'COGNITO_ID' has the format 'cognitoidp.REGION.amazonaws.com/COGNITO_USER_POOL_ID'

const client = new CloudWatchLogsClient({
  region: "ap-southeast-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "ap-southeast-2" }),
    identityPoolId: config.Auth.identityPoolId,
  }),
});

export default async function logToCloudWatch(message, type, data) {
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

  const body = {
    message,
    data,
    client_id,
    sub,
    username,
    event_id,
  };

  const logStreamName = "fixpdq-webapp-log-stream-" + username + "-" + event_id;

  var createLogStreamParams = {
    logGroupName: "fixpdq-webapp-log-group" /* required */,
    logStreamName,
  };

  const createLogStream = new CreateLogStreamCommand(createLogStreamParams);

  const createNewLogStream = async () => {
    client
      .send(createLogStream)
      .then((data) => {
        localStorage.setItem("activeLogStreamName", logStreamName);
        return logStreamName;
      })
      .catch((error) => {
        // console.error('createLogStream error:', error);
        return localStorage.getItem("activeLogStreamName");
      });
  };

  const activeLogStream =
    localStorage.getItem("activeLogStreamName") !== logStreamName
      ? limiter.schedule(() => createNewLogStream())
      : logStreamName;

  const bodyString = JSON.stringify(body);
  let messageBody = "";
  if (type === "error") {
    messageBody = "[ERROR] " + new Date() + " " + messageBody + bodyString;
  } else if (type === "warn") {
    messageBody = "[WARN] " + new Date() + " " + messageBody + bodyString;
  } else if (type === "debug") {
    messageBody = "[DEBUG] " + new Date() + " " + messageBody + bodyString;
  } else {
    messageBody = "[INFO] " + new Date() + " " + messageBody + bodyString;
  }

  const getNextSequenceToken = async () => {
    var createLogStreamParams = {
      logGroupName: "fixpdq-webapp-log-group" /* required */,
      orderBy: "LastEventTime",
      descending: true,
    };

    const describeLogStreams = new DescribeLogStreamsCommand(
      createLogStreamParams
    );

    return client
      .send(describeLogStreams)
      .then((data) => {
        // console.log('activeLogStream:', activeLogStream);
        const selectedStream = data.logStreams.filter(s => s.logStreamName === activeLogStream);
        // console.log('selectedStream:', selectedStream);
        return selectedStream.length>0 ? selectedStream[0].uploadSequenceToken : null;
      })
      .catch((error) => {
        console.error("describeLogStreams error:", error);
        return null;
      });
  };

  async function handleSendLog(logEvents) {

    localStorage.setItem("pendingLogs", []);

    const sequenceToken = await getNextSequenceToken();
    // console.log('sequenceToken:', sequenceToken);

    const putLogEventsParams = {
      logEvents,
      logGroupName: "fixpdq-webapp-log-group" /* required */,
      logStreamName: activeLogStream
        ? activeLogStream
        : "fixpdq-webapp-catch-all" /* required */,
      sequenceToken,
    };

    const putLogEvents = new PutLogEventsCommand(putLogEventsParams);

    client
      .send(putLogEvents)
      // .then(putEvents => console.log('Put Log Events:', putEvents))
      .catch((error) => {
        console.error("putEvents error:", error);
      });
  }

  const logEvent = {
    message: messageBody /* required */,
    timestamp: new Date().getTime() /* required */,
  };

  const existingPending = localStorage.getItem("pendingLogs")
      ? JSON.parse(localStorage.getItem("pendingLogs"))
      : [];


  existingPending.push(logEvent);
  const encodedNewPending = JSON.stringify(existingPending);

  const logsLastSent = localStorage.getItem("logsLastSent")
    ? localStorage.getItem("logsLastSent")
    : new Date().getTime();

  if(!localStorage.getItem("logsLastSent")) {
    localStorage.setItem("logsLastSent", logsLastSent);
  }

  if(new Date().getTime() - logsLastSent > 60000) {
    localStorage.setItem("logsLastSent", new Date().getTime());
    limiter.schedule(() => handleSendLog(existingPending));  
  }
}

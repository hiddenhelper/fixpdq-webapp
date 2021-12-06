const awsFixPDQWebapp = {
    Auth: {
      // Amazon Cognito Region
      region: "ap-southeast-2",

      // Amazon Cognito User Pool ID
      userPoolId: "ap-southeast-2_YmaroG5KO",

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: "1pbba60hp5ddg6onduqnmicved",

      // Amazon Cognito Identity Pool ID
      identityPoolId: 'ap-southeast-2:351b08c3-18fc-469d-828a-7615d447ee32'
      
    },
    API: {
      endpoints: [
        {
          name: 'main',
          endpoint: 'https://api.dev.fixpdq.app'
        }
      ]
    },
    webApp: {
      browserNotificationKey: 'BFjNOgWAjiHeu-Sh_MQ6-XheYn0EbALtMxBCCrZb3atCz08hup5tBMI4ZP_D-baVygSgBkyr45a_oNEJHcTYi-I'
    },
    Logging: {
      logGroupName: 'fixpdq-webapp-log-group',
      logStreamName: 'fixpdq-webapp-log-stream',
      sequenceToken: '123',
    },
  };

  export default awsFixPDQWebapp;

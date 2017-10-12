// Restoring a Session
window.onload = function(){
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            if(session.isValid()){
                document.getElementById("username").innerHTML = cognitoUser.getUsername();

                AWS.config.region = 'ap-southeast-1';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'ap-southeast-1:aa70ead9-45f0-4f5d-b862-0ff08cfebd2e',
                    Logins : {
                        'cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_3dbj6x7Wo' : session.getIdToken().getJwtToken()
                    }
                });

                var dynamoClient = new AWS.DynamoDB.DocumentClient();

                // var params = {
                //     TableName : 'MVCognito',
                //     Item: {
                //         IdentityId: AWS.config.credentials.identityId,
                //         "Login Count" : 1
                //     },
                //     Expected: {
                //         IdentityId: {
                //             Exists: false
                //         }
                //     }
                // };

                // dynamoClient.put(params, function(err, data) {
                //     if (err) {
                //         if(err.code == "ConditionalCheckFailedException"){
                //             console.log("That user already exists")
                //         }else{
                //             console.log(err)
                //         }
                //     }
                //     else console.log(data);
                // });

                // var dynamoClient = new AWS.DynamoDB.DocumentClient();

                // var params = {
                //     TableName:"MVCognito",
                //     Key:{
                //         IdentityId: AWS.config.credentials.identityId
                //     }
                // }

                // dynamoClient.get(params, function(err,data){
                //     if(err) console.log(err);
                //     else console.log(data);
                // })


                // var params = {
                //     TableName: "MVCognito"
                // };
                // dynamoClient.scan(params, function(err, data) {
                // if (err) console.log(err, err.stack); // an error occurred
                // else     console.log(data);           // successful response
                // /*
                // data = {
                //     TableNames: [
                //     "Forum", 
                //     "ProductCatalog", 
                //     "Reply", 
                //     "Thread"
                //     ]
                // }
                // */
                // });

                // var params = {
                //     TableName : 'MVCognito',
                //     Item: {
                //         UserId: AWS.config.credentials.identityId,
                //         "Login Count" : 1,
                //         // BoolAttribute: true,
                //         // ListAttribute: [1, 'two', false],
                //         // MapAttribute: { foo: 'bar'},
                //         // NullAttribute: null
                //     },
                //     Expected: {
                //         UserId: {
                //             Exists: false
                //         }
                //     }
                // };

                // dynamoClient.put(params, function(err, data) {
                //     if (err) {
                //         if(err.code == "ConditionalCheckFailedException"){
                //             console.log("That user already exists")
                //         }else{
                //             console.log(err)
                //         }
                //     }
                //     else console.log(data);
                // });

                var params = {
                    TableName : 'MVCognito',
                    Key: {
                        IdentityId: AWS.config.credentials.identityId
                    },
                    UpdateExpression: 'set #a = #a + :y',
                    //ConditionExpression: '#a < :MAX',
                    ExpressionAttributeNames: {'#a' : 'Login Count'},
                    ExpressionAttributeValues: {
                        ':y' : 1//,
                        //':MAX' : 5
                    }
                };

                dynamoClient.update(params, function(err, data) {
                    if (err) console.log(err);
                    else console.log(data);
                });

                
            };
        });
    }
};
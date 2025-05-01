# segsoft-project-1-instructions

The server is available at [https://auth-server-deploy.onrender.com]. The deployed server is hosted on Render and may take up to 50 seconds to load.

## 1- Register a user:

To register a user send a POST request to [https://auth-server-deploy.onrender.com/auth/register_user], with the username and password in the body as shown below.

```
{
  "username": " ",
  "password": " "
}
```

## 2- Register an application:

To register an application send a POST request to https://auth-server-deploy.onrender.com/auth/register_app , with the body as shown below.
 ```
{
  "appName": "TestApp",
  "redirectUri": "http://localhost:3001/callback"
}
```
 
The server will respond with a client ID and a client secret. Please save both for the following steps, as they will be needed.


## 3- Login

To access the log in page, simply go to the client app starting page (http://localhost:3001) and click the Login with Auth Server link.  Alternatively, you can go directly to the login page directly at http://localhost:3001/login.
Enter the client ID and secret that you previously received and click the Authorize button.


## 4- Authorize

After the previous step, you will be redirected the server’s authorize page, with the necessary parameters included in the url. The only thing that has to be done here is to click the Approve button.
If it is approved and the client credentials previously provided are correct, a token will be given which the client will display.
 
## 5- Protected Resource

This endpoint serves as a protected resource. To view it, it is necessary to send a valid token as a header. 
Send a GET request to https://auth-server-deploy.onrender.com/auth/protected with the token obtained in the last step as a header with the following format:

Key: Authorization
Value: Bearer insert-the-token-value-here

If the token is valid, a response with a simple message confirming your access to the resource will be returned. In addition, the response will include some information from the token.



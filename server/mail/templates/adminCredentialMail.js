exports.adminCredentialMail = (name,email,password) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Admin Account Created on CareerCloudHub</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="message">Admin Account Credentials</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your admin account has been successfully created.</p>
                <div>
                    <h4>Find Your Login Credentials Below</h4>
                    <p>Username/Email: ${email}</p>
                    <p>Password: ${password}</p>
                    <p>Login <a href="https://careercloudhub.com/admin/login" >Here</a></p>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
};

// <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
//     at
//     <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
// </div>
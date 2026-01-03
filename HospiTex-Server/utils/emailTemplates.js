// Professional Email Templates for HospiTex

export const welcomeEmailTemplate = (username, role) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HospiTex</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">HospiTex</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Healthcare Management System</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome, ${username}! 👋</h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for joining HospiTex, India's premier healthcare management platform. We're thrilled to have you on board!
                            </p>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #333333; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Your Account Details:</p>
                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> ${role === 'Patient' ? '✅ Verified' : '⏳ Pending Verification'}</p>
                            </div>
                            
                            ${role !== 'Patient' ? `
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                Your account is pending verification by our admin team. Once verified, you'll have full access to all features. We'll notify you via email once the verification is complete.
                            </p>
                            ` : `
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                Your account is active and ready to use! You can start booking appointments, accessing diagnostic services, and managing your healthcare needs right away.
                            </p>
                            `}
                            
                            <div style="text-align: center; margin: 40px 0 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Access Your Dashboard
                                </a>
                            </div>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                <strong>HospiTex</strong> - Transforming Healthcare Across India
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

export const otpEmailTemplate = (username, otp, type = 'verification') => {
  const isVerification = type === 'verification';
  const title = isVerification ? 'Email Verification OTP' : 'Password Reset OTP';
  const message = isVerification 
    ? 'Use this OTP to verify your email address. This OTP is valid for 5 minutes.'
    : 'Use this OTP to reset your password. This OTP is valid for 15 minutes.';
  const expiresIn = isVerification ? '5 minutes' : '15 minutes';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">HospiTex</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">${title}</h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Hello ${username},
                            </p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                ${message}
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
                                <p style="color: #ffffff; font-size: 14px; margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                                <div style="background-color: #ffffff; display: inline-block; padding: 20px 40px; border-radius: 8px; margin: 10px 0;">
                                    <p style="color: #667eea; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
                                </div>
                                <p style="color: #ffffff; font-size: 14px; margin: 20px 0 0 0; opacity: 0.9;">Valid for ${expiresIn}</p>
                            </div>
                            
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                                    <strong>⚠️ Security Notice:</strong> Never share your OTP with anyone. HospiTex staff will never ask for your OTP. If you didn't request this code, please ignore this email.
                                </p>
                            </div>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                If you're having trouble, please contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                <strong>HospiTex</strong> - Transforming Healthcare Across India
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

export const verificationEmailTemplate = (username, status) => {
  const isApproved = status === 'approved';
  const headerColor = isApproved ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
  const icon = isApproved ? '✅' : '❌';
  const title = isApproved ? 'Account Verified Successfully!' : 'Verification Status Update';
  const message = isApproved 
    ? 'Congratulations! Your account has been verified by our admin team. You now have full access to all features.'
    : 'Your account verification has been revoked. Please contact the admin team for more information.';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: ${headerColor}; padding: 40px 30px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 15px;">${icon}</div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${title}</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hello ${username},
                            </p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                ${message}
                            </p>
                            
                            ${isApproved ? `
                            <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #155724; font-size: 16px; margin: 0; font-weight: 600;">What's Next?</p>
                                <ul style="color: #155724; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px;">
                                    <li>Complete your profile setup</li>
                                    <li>Start using all platform features</li>
                                    <li>Connect with patients/doctors</li>
                                </ul>
                            </div>
                            
                            <div style="text-align: center; margin: 40px 0 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                                   style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Access Your Dashboard
                                </a>
                            </div>
                            ` : `
                            <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #721c24; font-size: 14px; margin: 0; line-height: 1.5;">
                                    If you believe this is an error, please contact our support team for assistance.
                                </p>
                            </div>
                            `}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                <strong>HospiTex</strong> - Transforming Healthcare Across India
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

export const loginNotificationEmailTemplate = (username, timestamp, location) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Login Detected</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">HospiTex</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">New Login Detected 🔐</h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hello ${username},
                            </p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                We detected a new login to your HospiTex account.
                            </p>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 8px; border: 1px solid #e9ecef;">
                                <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Login Details:</strong></p>
                                <p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Time:</strong> ${timestamp}</p>
                                ${location ? `<p style="color: #666666; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> ${location}</p>` : ''}
                            </div>
                            
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                                    <strong>⚠️ Security Alert:</strong> If this wasn't you, please change your password immediately and contact our support team.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                <strong>HospiTex</strong> - Transforming Healthcare Across India
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};


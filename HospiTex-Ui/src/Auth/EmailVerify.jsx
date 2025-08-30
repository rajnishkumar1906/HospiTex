import React from 'react';

const EmailVerify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        {/* Logo */}
        <h2 className="text-4xl font-extrabold text-green-700 mb-6">HospiTex</h2>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0H8m12 0A9 9 0 116 12a9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify Your Email
        </h3>

        <p className="text-gray-600 mb-6">
          We’ve sent a verification code to your email.  
          Please check your inbox and enter the code to activate your account.
        </p>

        {/* Input box */}
        <input
          type="text"
          placeholder="Enter verification code"
          className="w-full px-4 py-3 border rounded-xl text-center text-lg font-medium focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
        />

        {/* Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]">
          Verify Email
        </button>

        {/* Resend Link */}
        <p className="mt-4 text-sm text-gray-500">
          Didn’t receive an email?{" "}
          <button className="text-green-600 font-medium hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;

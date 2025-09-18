// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Define parameters for environment variables
const gmailUser = functions.params.defineString("GMAIL_USER");
const gmailAppPassword = functions.params.defineString("GMAIL_APP_PASSWORD");

admin.initializeApp();
const db = admin.firestore();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Use the .value() method to access the parameter's value
    user: gmailUser.value(),
    pass: gmailAppPassword.value(),
  },
});

/**
 * Generates a 4-digit OTP, stores it in Firestore with a 10-minute expiry,
 * and emails it to the user.
 */
interface SendOtpData {
  email: string;
}

export const sendOtp = functions.https.onCall(async (request) => {
  const data = request.data as SendOtpData;
  const email = data.email;

  if (!email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with one argument 'email'."
    );
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in Firestore
  await db.collection("otps").doc(email).set({
    otp,
    expiration,
  });

  // Email content
  const mailOptions = {
    from: `Stream App <${gmailUser.value()}>`,
    to: email,
    subject: "Your Verification Code",
    html: `<p>Your verification code is: <strong>${otp}</strong></p>
           <p>This code will expire in 10 minutes.</p>`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    // Re-throw the error so the client knows something went wrong.
    throw new functions.https.HttpsError(
      "internal",
      "Could not send the email."
    );
  }
});

/**
 * Verifies the provided OTP against the one stored in Firestore.
 */
interface VerifyOtpData {
  email: string;
  otp: string;
}

export const verifyOtp = functions.https.onCall(async (request) => {
  const data = request.data as VerifyOtpData;
  const email = data.email;
  const otp = data.otp;

  if (!email || !otp) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with 'email' and 'otp'."
    );
  }

  const otpDoc = await db.collection("otps").doc(email).get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError("not-found", "OTP not found.");
  }

  const docData = otpDoc.data();
  if (!docData) {
    throw new functions.https.HttpsError("internal", "OTP data is missing.");
  }

  const now = new Date();
  if (now > docData.expiration.toDate()) {
    throw new functions.https.HttpsError("deadline-exceeded", "OTP expired.");
  }

  if (docData.otp !== otp) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid OTP.");
  }

  // OTP is valid, delete it so it can't be reused
  await otpDoc.ref.delete();

  return { success: true, message: "OTP verified successfully." };
});

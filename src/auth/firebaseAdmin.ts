import * as admin from "firebase-admin";
import { NextApiRequest } from "next";

const verifyIdToken = (token: string) => {
  // Note that ?? is nullish collaesing to deal with values that return as null.
  const firebasePrivateKey: string = process.env.FIREBASE_PRIVATE_KEY ?? "";

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Google places an extra backslash before \n, so we need to replace all occurences of \\n with \n.
        privateKey: firebasePrivateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch(() => null);
};

// string for the user id or null if not logged in.
export const loadIdToken = async (
  req: NextApiRequest
): Promise<string | null> => {
  // There is no token in the cookie, the user is not logged in.
  if (!req.cookies.token) return null;

  // Otherwise there is a cookie, but is the cookie jiberish?
  const decoded = await verifyIdToken(req.cookies.token);

  // If the decoding fails, then the cookie is forged or jiberish.
  if (!decoded) return null;

  return decoded.uid;
};

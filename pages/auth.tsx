import Layout from "src/components/layout";
import FirebaseAuth from "src/components/firebaseAuth";
import { GetServerSideProps, NextApiRequest } from "next";
import { loadIdToken } from "src/auth/firebaseAdmin";

export default function Auth() {
  return <Layout main={<FirebaseAuth />}></Layout>;
}

// Get server side props runs on the next server not the frontend.
// Kick the user out of the auth page before they even see a render.

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  // If the user is logged in, send them back to the homepage.
  if (uid) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};

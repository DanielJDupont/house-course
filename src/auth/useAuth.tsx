import { useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "./initFirebase";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";

/*
We need to create a custom auth provider here.
*/

initFirebase();

interface IAuthContext {
  user: firebase.User | null;
  logout: () => void;
  authenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  logout: () => null,
  authenticated: false,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter();

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Send the user back to the home page upon signout.
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        // The user is logged in, and firebase is telling us about it.
        if (user) {
          const token = await user.getIdToken();
          setTokenCookie(token);
          setUser(user);
        } else {
          // The user is logged out, because user is either a firebase.user or null.
          removeTokenCookie();
          setUser(null);
        }
      });

    return () => {
      // No longer listen to auth changes when the provider is unmounted.
      cancelAuthListener();
    };
  }, []);

  return (
    // Shows the user data, flag is true or false the user is authenticated, and a logout functionality.
    <AuthContext.Provider value={{ user, logout, authenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

/*
Firebase notifies us when the token is no longer valid, we need to listen to it.
When the token is no longer valid, remove the user in the state and remove the setup cookie.
Or if the user wants to login, set the user and set the token.
*/

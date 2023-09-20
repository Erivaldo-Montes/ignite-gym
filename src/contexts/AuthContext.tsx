import React, { createContext, useState, useEffect } from "react";

import {
  createUserStorage,
  getUserStorage,
  removeUserStorage,
} from "@storage/userStorage";
import {
  createAuthTokenStorage,
  getAuthTokenStorage,
  removeAuthTokenStorage,
} from "@storage/authStorage";
import { UserDTO } from "@DTOs/UserDTO";
import { api } from "@services/api";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type Props = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);
  }
  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", {
        email,
        password,
      });

      console.log(data.token);
      if (data.user && data.token) {
        setIsLoadingUserStorageData(true);
        await createUserStorage(data.user);
        await createAuthTokenStorage(data.token);
        await userAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function saveUserAndTokenStorage(userData: UserDTO, token: string) {}

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      removeAuthTokenStorage();
      setUser({} as UserDTO);
      await removeUserStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function getUserData() {
    try {
      setIsLoadingUserStorageData(true);
      const userLogged = await getUserStorage();
      const token = await getAuthTokenStorage();
      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

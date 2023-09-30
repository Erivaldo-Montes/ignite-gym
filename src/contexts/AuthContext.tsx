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
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
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
      if (data.user && data.token && data.refresh_token) {
        setIsLoadingUserStorageData(true);
        await createUserStorage(data.user);
        await createAuthTokenStorage({
          token: data.token,
          refresh_token: data.refresh_token,
        });
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
      const { token } = await getAuthTokenStorage();
      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await createUserStorage(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    const subcribe = api.registerInterceptTokenManager(signOut);
    return () => {
      subcribe();
    };
  }, [signOut]);
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

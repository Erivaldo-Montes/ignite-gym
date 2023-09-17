import React, { createContext, useState } from "react";
import { UserDTO } from "@DTOs/UserDTO";

import { api } from "@services/api";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type Props = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", {
        email,
        password,
      });

      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

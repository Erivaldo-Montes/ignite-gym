import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "./storageConfig";

type AuthToken = {
  token: string;
  refresh_token: string;
};

export async function createAuthTokenStorage({
  token,
  refresh_token,
}: AuthToken) {
  try {
    await AsyncStorage.setItem(
      AUTH_TOKEN_STORAGE,
      JSON.stringify({ token, refresh_token })
    );
  } catch (error) {
    throw error;
  }
}

export async function getAuthTokenStorage() {
  try {
    const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);
    const { token, refresh_token }: AuthToken = response
      ? JSON.parse(response)
      : {};

    return { token, refresh_token };
  } catch (error) {
    throw error;
  }
}

export async function removeAuthTokenStorage() {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
  } catch (error) {
    throw error;
  }
}

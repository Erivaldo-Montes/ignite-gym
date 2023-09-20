import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "@DTOs/UserDTO";
import { USER_STORAGE } from "./storageConfig";

export async function createUserStorage(user: UserDTO) {
  try {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
  } catch (error) {
    throw error;
  }
}

export async function getUserStorage() {
  try {
    const data = await AsyncStorage.getItem(USER_STORAGE);

    const user = data ? JSON.parse(data) : {};

    return user;
  } catch (error) {
    throw error;
  }
}

export async function removeUserStorage() {
  try {
    await AsyncStorage.removeItem(USER_STORAGE);
  } catch (error) {
    throw error;
  }
}

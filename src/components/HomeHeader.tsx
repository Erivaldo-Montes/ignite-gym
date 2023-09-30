import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { UserPhoto } from "./UserPhoto";
import { useAuth } from "@hooks/useAuth";

import DefaultUserPng from "@assets/userPhotoDefault.png";
import { api } from "@services/api";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack bg={"gray.600"} pt={16} pb={6} px={8} alignItems={"center"}>
      <UserPhoto
        size={16}
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : DefaultUserPng
        }
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack flex={1}>
        <Text color={"gray.100"} fontSize={"md"}>
          Olá,
        </Text>
        <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
          onPress={signOut}
        />
      </TouchableOpacity>
    </HStack>
  );
}

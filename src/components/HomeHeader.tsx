import { HStack, Heading, Text, VStack } from "native-base";
import { UserPhoto } from "./UserPhoto";
export function HomeHeader() {
  return (
    <HStack bg={"gray.600"} pt={16} pb={6} px={8} alignItems={"center"}>
      <UserPhoto
        size={10}
        source={{
          uri: "https://github.com/Erivaldo-Montes.png",
        }}
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack>
        <Text color={"gray.100"} fontSize={"md"}>
          Olá,
        </Text>
        <Heading color={"gray.100"} fontSize={"md"}>
          Erivaldo
        </Heading>
      </VStack>
    </HStack>
  );
}

import { VStack, Image, Text, Center, Heading } from "native-base";
import LogoSvg from "@assets/logo.svg";
import backgroundImage from "@assets/Background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignIn() {
  return (
    <VStack flex={1} bg={"gray.700"} px={10}>
      <Image
        source={backgroundImage}
        alt="Pessoas treinando em uma acadêmia"
        resizeMode="contain"
        position={"absolute"}
      />
      <Center my={24}>
        <LogoSvg />

        <Text color={"gray.100"} fontSize={"sm"}>
          Treine sua mente e o seu corpo
        </Text>
      </Center>

      <Center>
        <Heading
          fontSize={"xl"}
          color={"gray.100"}
          mb={6}
          fontFamily={"heading"}
        >
          Acesso a conta
        </Heading>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input placeholder="Senha" secureTextEntry />

        <Button title="Acessar" />
      </Center>
    </VStack>
  );
}

import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { AuthNavigationRoutesProps } from "@routes/auth.route";

import LogoSvg from "@assets/logo.svg";
import backgroundImage from "@assets/Background.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignIn() {
  const navigation = useNavigation<AuthNavigationRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={backgroundImage}
          alt="Pessoas treinando em uma acadêmia"
          // carrega a imagem mais rápido
          defaultSource={backgroundImage}
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
        <Center mt={24}>
          <Text color={"gray.100"} fontSize={"sm"} mb={3} fontFamily={"body"}>
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant={"outline"}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}

import { VStack, Icon, HStack, Heading, Text, Image, Box } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import RepetitionSvg from "@assets/repetitions.svg";
import SeriesSvg from "@assets/series.svg";

export function Exercise() {
  const navigation = useNavigation();
  function handleGoBack() {
    navigation.goBack();
  }

  function handlAddNewExercise() {
    return;
  }
  return (
    <VStack flex={1}>
      <VStack px={8} bg={"gray.500"} pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color={"green.500"} size={6} />
        </TouchableOpacity>
        <HStack
          justifyContent={"space-between"}
          mt={4}
          mb={8}
          alignItems={"center"}
        >
          <Heading color={"gray.100"} fontSize={"lg"} flexShrink={1}>
            Puxada frontal
          </Heading>

          <HStack alignItems={"center"}>
            <BodySvg />
            <Text color={"gray.200"} ml={1} textTransform={"capitalize"}>
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p={8}>
        <Image
          w="full"
          h={80}
          source={{
            uri: "https://www.origym.com.br/banners/remada-unilateral-3.jpg",
          }}
          alt="imagem do exercício"
          mb={3}
          resizeMode="cover"
          rounded={"lg"}
        />

        <Box bg={"gray.600"} rounded={"md"} pb={4} px={4}>
          <HStack
            alignItems={"center"}
            justifyContent={"space-around"}
            mt={5}
            mb={6}
          >
            <HStack>
              <SeriesSvg />

              <Text color={"gray.200"} ml={2}>
                3 Séries
              </Text>
            </HStack>
            <HStack>
              <RepetitionSvg />

              <Text color={"gray.200"} ml={2}>
                3 Repetições
              </Text>
            </HStack>
          </HStack>

          <Button title={"Marcar como realizado"} />
        </Box>
      </VStack>
    </VStack>
  );
}

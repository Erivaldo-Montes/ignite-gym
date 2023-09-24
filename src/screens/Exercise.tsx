import { useEffect, useState } from "react";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Button } from "@components/Button";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@DTOs/ExerciseDTO";

import BodySvg from "@assets/body.svg";
import RepetitionSvg from "@assets/repetitions.svg";
import SeriesSvg from "@assets/series.svg";
import { Loading } from "@components/Loading";

type RoutesParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation();
  const toast = useToast();
  const routes = useRoute();
  const { exerciseId } = routes.params as RoutesParamsProps;
  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível obter os detalhes do exercício";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
    console.log(`${api.defaults.baseURL}/exercise/demo/${exercise.demo}`);
  }, [exerciseId]);
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
          <Heading
            color={"gray.100"}
            fontSize={"lg"}
            flexShrink={1}
            fontFamily={"heading"}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems={"center"}>
            <BodySvg />
            <Text color={"gray.200"} ml={1} textTransform={"capitalize"}>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack p={8}>
            <Box rounded={"lg"} mb={3} overflow={"hidden"}>
              <Image
                w="full"
                h={80}
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt="imagem do exercício"
                resizeMode="cover"
                rounded={"lg"}
              />
            </Box>

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
        </ScrollView>
      )}
    </VStack>
  );
}

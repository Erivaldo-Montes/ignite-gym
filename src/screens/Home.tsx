import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { VStack, Text, HStack, FlatList, Heading, useToast } from "native-base";

import { AppNavigatorRouteProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@DTOs/ExerciseDTO";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { Loading } from "@components/Loading";

export function Home() {
  const [isFetchExercise, setIsFetchExercise] = useState(true);
  const [groups, setGroup] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, isGroupSelected] = useState("antebraço ");
  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRouteProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    return navigation.navigate("exercise", {
      exerciseId,
    });
  }

  async function fetchMuscularGroups() {
    try {
      const response = await api.get("/groups");
      setGroup(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os groupos";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setIsFetchExercise(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os exercícios";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsFetchExercise(false);
    }
  }
  useEffect(() => {
    fetchMuscularGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExerciseByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={
                String(groupSelected).toUpperCase() ===
                String(item).toUpperCase()
              }
              onPress={() => isGroupSelected(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 8 }}
          my={10}
          maxH={10}
        />
      </HStack>

      {isFetchExercise ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent={"space-between"}>
            <Heading color={"gray.200"} fontSize={"md"} fontFamily={"heading"}>
              Exercícios
            </Heading>
            <Text color={"gray.200"} fontSize={"sm"}>
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}

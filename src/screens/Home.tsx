import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, HStack, FlatList, Heading } from "native-base";

import { AppNavigatorRouteProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home() {
  const [groups, setGroup] = useState(["Ombro", "bíceps", "Tríceps", "Costas"]);
  const [exercises, setExercises] = useState([
    "Puxada frontal",
    "Remada curvada",
    "Remada unilateral",
    "Levantamento terra",
  ]);
  const [groupSelected, isGroupSelected] = useState("Ombro");

  const navigation = useNavigation<AppNavigatorRouteProps>();

  function handleOpenExerciseDetails() {
    return navigation.navigate("exercise");
  }

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

      <VStack flex={1} px={8}>
        <HStack justifyContent={"space-between"}>
          <Heading color={"gray.200"} fontSize={"md"}>
            Exercícios
          </Heading>
          <Text color={"gray.200"} fontSize={"sm"}>
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}

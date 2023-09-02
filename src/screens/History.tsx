import { useState } from "react";
import { VStack, Text, Heading, SectionList } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

export function History() {
  const [historyExercise, setHistoryExercise] = useState([
    { title: "26.07.2024", data: ["Costas", "Puxada Frontal"] },
    { title: "27.07.2024", data: ["Puxada Frontal"] },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      <SectionList
        sections={historyExercise}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color={"gray.200"} fontSize={"md"} mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          historyExercise.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color={"gray.100"} textAlign={"center"}>
            Não há exercícios registrados. {"\n"}Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}

import { useState, useCallback } from "react";
import { VStack, Text, Heading, SectionList, useToast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "@services/api";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { AppError } from "@utils/AppError";
import { HistoryByDayDTO } from "@DTOs/HistoryByDayDTO";

export function History() {
  const [historyExercise, setHistoryExercise] = useState<HistoryByDayDTO[]>([]);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get("/history");
      setHistoryExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível obter o histórico";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      <SectionList
        sections={historyExercise}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color={"gray.200"}
            fontSize={"md"}
            mt={10}
            mb={3}
            fontFamily={"heading"}
          >
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

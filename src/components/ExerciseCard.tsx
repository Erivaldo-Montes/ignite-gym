import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { api } from "@services/api";
import { Entypo } from "@expo/vector-icons";
import { ExerciseDTO } from "@DTOs/ExerciseDTO";

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={"gray.500"}
        p={2}
        pr={4}
        alignItems={"center"}
        rounded={"md"}
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          w={16}
          h={16}
          rounded={"md"}
          mr={4}
          resizeMode="cover"
          alt="imagem do exercício"
        />

        <VStack flex={1}>
          <Heading fontSize={"lg"} color={"white"} fontFamily={"heading"}>
            {data.name}
          </Heading>
          <Text color={"gray.200"} fontSize={"sm"} numberOfLines={2}>
            {data.series} Séries x {data.repetitions} Repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name={"chevron-thin-right"} color={"gray.300"} />
      </HStack>
    </TouchableOpacity>
  );
}

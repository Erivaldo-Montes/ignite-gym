import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { Entypo } from "@expo/vector-icons";

type Props = TouchableOpacityProps & {};

export function ExerciseCard({ ...rest }: Props) {
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
            uri: "https://www.origym.com.br/banners/remada-unilateral-3.jpg",
          }}
          w={16}
          h={16}
          rounded={"md"}
          mr={4}
          resizeMode="center"
          alt="imagem do exercício"
        />

        <VStack flex={1}>
          <Heading fontSize={"lg"} color={"white"}>
            Remada Unilateral
          </Heading>
          <Text color={"gray.200"} fontSize={"sm"} numberOfLines={2}>
            3 Séries x 12 Repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name={"chevron-thin-right"} color={"gray.300"} />
      </HStack>
    </TouchableOpacity>
  );
}

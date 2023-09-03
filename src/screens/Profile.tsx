import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
} from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33;

export function Profile() {
  const [PhotoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const userPhotoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (userPhotoSelected.canceled) {
        return;
      }

      if (userPhotoSelected.assets[0].uri) {
        const userPhotoSelectedInfo = await FileSystem.getInfoAsync(
          userPhotoSelected.assets[0].uri
        );

        if (
          userPhotoSelectedInfo &&
          userPhotoSelectedInfo.size / 1024 / 1024 > 5
        )
          return Alert.alert(
            "Essa imagem é muito grande, escolha uma com menos 5MB"
          );
        setUserPhoto(userPhotoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 12 }}>
        <Center mt={6} px={10}>
          {PhotoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded={"full"}
              startColor={"gray.600"}
              endColor={"gray.400"}
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Foto do perfil"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity>
            <Text
              color={"green.500"}
              fontWeight={"bold"}
              fontSize={"md"}
              mt={2}
              mb={8}
              onPress={handleUserPhotoSelect}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input placeholder="Nome" bg={"gray.600"} />
          <Input placeholder="E-mail" bg={"gray.600"} isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={6}>
          <Heading color={"gray.200"} mb={2} fontSize={"md"}>
            Alterar Senha
          </Heading>

          <Input placeholder="Senha atual" bg={"gray.600"} secureTextEntry />
          <Input placeholder="Nova senha" bg={"gray.600"} secureTextEntry />
          <Input
            placeholder="Confirme a nova senha"
            bg={"gray.600"}
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}

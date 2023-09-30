import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from "native-base";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import DefaultUserPng from "@assets/userPhotoDefault.png";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
  name: yup.string(),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 digítos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password")], "A confirmação de senha não confere")
    .when("password", {
      is: (field: any) => field,
      then: () =>
        yup
          .string()
          .nullable()
          .required("Informe a confirmação da senha")
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [PhotoIsLoading, setPhotoIsLoading] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

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
          return toast.show({
            title: "Essa imagem é muito grande, escolha uma com menos 5MB",
            placement: "top",
            bgColor: "red.500",
          });

        const fileExtention = userPhotoSelected.assets[0].uri.split(".").pop();
        console.log(fileExtention);
        const photoFile = {
          name: `${user.name}.${fileExtention}`.toLocaleLowerCase(),
          uri: userPhotoSelected.assets[0].uri,
          type: `${userPhotoSelected.assets[0].type}/${fileExtention}`,
        } as any;
        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);
        const response = await api.patch("/users/avatar", userPhotoUploadForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const userPhotoUpdated = user;
        userPhotoUpdated.avatar = response.data.avatar;
        updateUserProfile(userPhotoUpdated);
        toast.show({
          title: "Foto atualizada",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: UserFormData) {
    try {
      setIsUpdating(true);
      const userUpdated = user;
      userUpdated.name = data.name;
      await api.put("/users", data);
      await updateUserProfile(userUpdated);
      toast.show({
        title: "Perfil atualizado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível atualizar perfil";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdating(false);
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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : DefaultUserPng
              }
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg={"gray.600"}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                bg={"gray.600"}
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={6}>
          <Heading
            color={"gray.200"}
            mb={2}
            fontSize={"md"}
            fontFamily={"heading"}
          >
            Alterar Senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha atual"
                bg={"gray.600"}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nova senha"
                bg={"gray.600"}
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirme a nova senha"
                errorMessage={errors.confirm_password?.message}
                bg={"gray.600"}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}

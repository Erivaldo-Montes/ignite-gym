import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg={"gray.700"}
      h={14}
      px={4}
      borderWidth={1}
      borderColor={"transparent"}
      fontSize={"md"}
      mb={4}
      color={"white"}
      placeholderTextColor={"gray.300"}
      _focus={{
        bg: "gray.700",
        borderColor: "green.300",
        borderWidth: 1,
      }}
      {...rest}
    />
  );
}

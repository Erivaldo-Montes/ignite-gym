import { Center, Heading } from "native-base";

type Props = {
  title: string;
};

export function ScreenHeader({ title }: Props) {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading fontSize={"xl"} color="gray.100">
        {title}
      </Heading>
    </Center>
  );
}
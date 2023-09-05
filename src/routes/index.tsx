import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useTheme, Box } from "native-base";

import { AppRoutes } from "./app.routes";
import { AuthRoute } from "./auth.route";

export function Routes() {
  const { colors } = useTheme();

  const THEME = DefaultTheme;
  THEME.colors.background = colors.gray["700"];
  return (
    <Box flex={1} bg={"gray.700"}>
      <NavigationContainer theme={THEME}>
        <AuthRoute />
      </NavigationContainer>
    </Box>
  );
}

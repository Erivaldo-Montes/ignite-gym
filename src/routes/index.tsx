import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useTheme, Box } from "native-base";

import { AppRoutes } from "./app.routes";
import { AuthRoute } from "./auth.route";

import { useAuth } from "@hooks/useAuth";

export function Routes() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const THEME = DefaultTheme;
  THEME.colors.background = colors.gray["700"];
  return (
    <Box flex={1} bg={"gray.700"}>
      <NavigationContainer theme={THEME}>
        {user.id ? <AppRoutes /> : <AuthRoute />}
      </NavigationContainer>
    </Box>
  );
}

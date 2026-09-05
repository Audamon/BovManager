import { render, screen } from "@testing-library/react-native";
import SplashScreen from "./splashScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

describe("SplashScreen", () => {
  beforeEach(async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, bottom: 0, right: 0 },
        }}
      >
        <SplashScreen />
      </SafeAreaProvider>,
    );
  });
  it("renderiza a logo", () => {
    expect(screen.getByTestId("splash-logo")).toBeTruthy();
  });
  it("renderiza nome do app", () => {
    expect(screen.getByText("BovManager")).toBeTruthy();
  });
  it("renderiza spinner", () => {
    expect(screen.getByTestId("spinner")).toBeTruthy();
  });
  it("renderiza texto de checagem de sessão", () => {
    expect(screen.getByText("Verificando sessão...")).toBeTruthy();
  });
});

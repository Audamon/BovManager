import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadingState from "./LoadingState";
describe("tela de carregamento do rebanho", () => {
  beforeEach(async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, bottom: 0, right: 0 },
        }}
      >
        <LoadingState />
      </SafeAreaProvider>,
    );
  });
  it("renderiza placeholder de carregamento", () => {
    expect(screen.getAllByTestId("loading-placeholder")).toBeTruthy();
  });
});

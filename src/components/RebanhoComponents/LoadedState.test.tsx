import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadedState from "./LoadedState";

describe("tela com os dados carregados", () => {
  beforeEach(async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, bottom: 0, right: 0 },
        }}
      >
        <LoadedState />
      </SafeAreaProvider>,
    );
    it("renderiza componente com os dados do animal", () => {
      expect(screen.getAllByTestId("data-component")).toBeTruthy();
    });
  });
});

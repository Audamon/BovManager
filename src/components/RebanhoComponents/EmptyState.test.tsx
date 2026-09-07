import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import EmptyState from "./EmptyState";
describe("teste do empyt state da tela de rebanho", () => {
  beforeEach(async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, bottom: 0, right: 0 },
        }}
      >
        <EmptyState />
      </SafeAreaProvider>,
    );
  });
  it("renderiza o titulo de vazio", () => {
    expect(screen.getByText("Nenhum animal cadastrado ainda")).toBeTruthy();
  });
  it("renderiza o icone de tag", () => {
    expect(screen.getByTestId("tag-on")).toBeTruthy();
  });
  it("renderiza o subtitulo de vazio", () => {
    expect(screen.getByText("Escaneie o brinco do seu primeiro animal pra começar.")).toBeTruthy();
  });
  it("renderiza o botão de escanear", () => {
    expect(screen.getByTestId("button-scan")).toBeTruthy();
  });
});

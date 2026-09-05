/**
 * Paleta do BovManager — "Verde Pasto & Terra".
 *
 * Duas camadas:
 *  - PALETTE: a rampa completa (50–900) de cada família. É o material bruto —
 *    não usar direto em componentes, só para derivar tokens semânticos.
 *  - COLORS: os 8 tons-base do projeto (headers, CTA, texto, fundo, estados),
 *    resolvidos a partir da PALETTE. É o que os componentes mais simples usam.
 *
 * Para telas que já pensam em claro/escuro, use os tokens de `theme.ts`
 * (Colors.light / Colors.dark), que também são derivados desta mesma PALETTE.
 */

export const PALETTE = {
  // Verde Musgo — marca. Header, botão primário, navegação ativa.
  primary: {
    50: "#EEF6EC", // fundo de hover/seleção bem sutil sobre superfície clara
    100: "#D6EACE", // fundo de chip/tag "relacionado à marca" quando inativo
    200: "#AED89F",
    300: "#82C077", // cor do botão/ícone primário em modo escuro
    400: "#4F9A52", // hover do botão primário em modo escuro
    500: "#2E6F40", // ⭑ base — igual a COLORS.primary
    600: "#235A34", // pressed/hover do botão primário em modo claro
    700: "#1B4728", // texto sobre um fundo primary/50 (link dentro de card verde)
    800: "#14351E",
    900: "#0D2314", // bloco "verde quase preto" em telas de resumo/estatística
  },
  // Laranja Terra — ação de destaque. Reservado ao "Escanear brinco".
  secondary: {
    50: "#FDF2E6",
    100: "#FADFC2", // fundo de badge de destaque (ex.: "novo cadastro")
    200: "#F5BF88",
    300: "#EF9F53", // cor do CTA de escanear em modo escuro
    400: "#EC8B36",
    500: "#E67E22", // ⭑ base — igual a COLORS.secondary
    600: "#BE651B", // pressed/hover do CTA em modo claro
    700: "#964F16",
    800: "#6E3A10",
    900: "#47250A",
  },
  // Palha — neutros com viés quente (nunca cinza puro). Fundo, texto, bordas.
  neutral: {
    0: "#FFFFFF", // = COLORS.surface — cards, modais, inputs
    50: "#F4F6F0", // = COLORS.background — fundo de tela no modo claro
    100: "#E5E8DD", // fundo de item de lista alternado, divisor bem sutil
    200: "#CCD2BE", // borda de input, separador de lista
    300: "#AAB39A", // ícone inativo, placeholder de texto
    400: "#838F76",
    // 500 escurecido em relação ao tom original (#6C7A70, 4.1:1 contra o
    // fundo — abaixo até do mínimo de leitura indoor). Sol forte reduz ainda
    // mais o contraste percebido, então todo texto secundário no campo
    // precisa de folga: #465142 dá 7.7:1 contra o fundo e 8.4:1 sobre branco.
    500: "#465142", // = COLORS.textMuted — rótulo, subtítulo, timestamp, nº do brinco
    600: "#3F4938", // texto muted sobre fundo escuro
    700: "#3D453D", // superfície elevada (card) em modo escuro
    800: "#262B24", // superfície base em modo escuro
    900: "#1A251E", // = COLORS.textMain — texto principal / fundo de tela no escuro
  },
  // Status positivo — deslocado do verde da marca para não ler como "botão".
  // Selo de status é sempre fundo sólido + texto branco (nunca fundo em tom
  // pastel — sob sol forte, um selo pastel some contra o branco do card:
  // a diferença de contraste entre os dois fica abaixo de 1.2:1).
  success: {
    50: "#E9F9EF", // tom "quieto" opcional p/ uso indoor — nunca em selo de status
    100: "#C7F0D6",
    200: "#94E0B0",
    300: "#5FCE89",
    400: "#3DC073",
    500: "#27AE60", // ⭑ base — igual a COLORS.success
    600: "#1F8C4D",
    700: "#17693B", // fundo do selo "Saudável"/"Vacinado" — 6.7:1 com texto branco
    800: "#104828",
    900: "#082716",
  },
  // Status negativo — alertas, erro de leitura de brinco, ações destrutivas.
  // Mesma regra do success: selo sempre em fundo sólido, nunca pastel.
  danger: {
    50: "#FBEAE7", // tom "quieto" opcional p/ uso indoor — nunca em selo de status
    100: "#F4C9C1",
    200: "#E9A093",
    300: "#DC7565",
    400: "#CD5140",
    500: "#C0392B", // ⭑ base — igual a COLORS.danger
    600: "#9C2E22", // fundo do selo "Doente"/alerta — 7.4:1 com texto branco
    700: "#78241B",
    800: "#541A13",
    900: "#33100B",
  },
} as const;

/**
 * Os 8 tons-base do projeto. Valores idênticos aos originais — só passaram
 * a ser resolvidos a partir da PALETTE acima, pra não existir hex duplicado
 * (e cor da marca) em dois lugares.
 */
export const COLORS = {
  primary: PALETTE.primary[500], // Verde Musgo (Headers e botões principais)
  secondary: PALETTE.secondary[500], // Laranja Terra (Scan e destaques)
  background: PALETTE.neutral[50], // Off-white (Fundo descansado pro sol)
  surface: PALETTE.neutral[0], // Cards e modais
  textMain: PALETTE.neutral[900], // Texto escuro
  textMuted: PALETTE.neutral[500], // Rótulos e subtítulos
  danger: PALETTE.danger[500], // Alertas e erros
  success: PALETTE.success[500], // Status ok / vacinado
} as const;

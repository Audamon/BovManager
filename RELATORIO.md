# Relatório de Desenvolvimento — BovManager

> Documento de acompanhamento do desenvolvimento do projeto, atualizado conforme novas etapas são concluídas. Serve como registro técnico das decisões tomadas, do que foi implementado e dos problemas resolvidos ao longo do caminho.

## 1. Visão geral

BovManager é um aplicativo de gerenciamento de rebanho bovino: leitura do QR code do brinco do animal, cadastro, transferência de brinco entre animais e histórico de saúde/vacinação. Pensado para uso no campo — offline-first, com uma paleta de cores ajustada especificamente para legibilidade em sol forte.

Projeto acadêmico, com o objetivo adicional de compor portfólio profissional.

## 2. Configuração inicial do ambiente

| Item | Escolha | Motivo |
|---|---|---|
| Framework | Expo Router (React Native 0.86 + React 19 + TypeScript) | Roteamento por arquivos, build gerenciado pela Expo, atualização simples do SDK |
| Lint | ESLint 9, preset `eslint-config-expo/flat` | Config oficial mantida pela própria Expo, já alinhada com as regras do React Native |
| Formatação | Prettier + `eslint-config-prettier` | Prettier cuida só de formatação; o eslint-config-prettier desliga as regras de estilo do ESLint que brigariam com ele |
| Testes | Jest (`jest-expo`) + `@testing-library/react-native` | Preset oficial da Expo para o ambiente de teste; Testing Library para testar componentes pela perspectiva do usuário (o que aparece na tela), não pela implementação interna |
| Versionamento | Git + GitHub | — |

## 3. Identidade visual

### 3.1 Paleta de cores — "Verde Pasto & Terra"

A paleta parte de 8 tons originais (verde musgo, laranja terra, off-white, branco, dois tons de texto, vermelho e verde de status) e foi expandida em `src/constants/colors.ts` para rampas completas de 10 degraus por família (`PALETTE`), com os tokens semânticos de tema claro/escuro derivados dela em `src/constants/theme.ts`.

**Ajuste de contraste para uso no campo**: como o app é usado a céu aberto, testamos o contraste real (fórmula do WCAG) de cada combinação de cor antes de fechar a paleta:

| Elemento | Antes | Depois |
|---|---|---|
| Texto secundário / nº do brinco sobre o fundo | 4.1 : 1 (abaixo do mínimo até para uso interno) | 7.7 : 1 |
| Fundo do selo de status vs. card branco | 1.1 : 1 (quase invisível sob sol forte) | Selo em fundo sólido, não mais em tom pastel |
| Selo "Saudável" (texto branco sobre fundo) | 3.9 : 1 | 6.7 : 1 |
| Selo "Doente" (texto branco sobre fundo) | 5.4 : 1 | 7.4 : 1 |
| Texto sobre o botão de destaque (laranja) | 4.8 : 1 | 5.6 : 1 |

Regra adotada: nenhum selo de status usa fundo em tom pastel (some sob sol direto); sempre fundo sólido + texto branco.

### 3.2 Tipografia

- **Big Shoulders** (títulos e cabeçalhos) — via `@expo-google-fonts/big-shoulders`, carregada com `useFonts` (`expo-font`).
- **Karla** (texto corrido).
- **IBM Plex Mono** (dados: número do brinco, datas, valores tabulares).

### 3.3 Mockups

Todas as telas do app (splash, login, criar conta, rebanho — populado/vazio/carregando, detalhe do animal, escanear — idle/sucesso/não encontrado/sem permissão, cadastrar animal, transferir brinco, histórico, perfil) foram desenhadas como mockups estáticos antes da implementação, cobrindo os principais estados de cada tela (vazio, carregando, erro, sucesso).

### 3.4 Ícones

Todos os ícones do app são SVG desenhados à mão (não são imagens importadas), guardados como referência em `assets/icons/` e implementados como componentes React em `src/components/icons/`, usando `react-native-svg`. Os ícones da barra de navegação (Rebanho, Histórico, Perfil) têm duas versões — contorno (inativo) e preenchida (ativo) — usadas pra sinalizar a aba selecionada sem depender só de diferença de cor (ver seção 6.2).

## 4. Arquitetura de navegação

Estrutura de rotas do Expo Router:

```
src/app/
  index.tsx        # tela raiz — checagem inicial (sessão/fontes)
  (auth)/
    login.tsx
  (app)/
    _layout.tsx    # barra de abas (Tabs)
    rebanho.tsx
    escanear.tsx
    historico.tsx
    perfil.tsx
```

Grupos entre parênteses (`(auth)`, `(app)`) não aparecem na URL da rota — só organizam os arquivos.

## 5. Dependências e decisões técnicas

| Dependência | Papel |
|---|---|
| `expo-camera` | Leitura do QR code do brinco |
| `expo-sqlite` + `drizzle-orm` | Persistência local, offline-first (Drizzle é o ORM; expo-sqlite é o driver nativo por baixo) |
| `expo-secure-store` | Armazenamento seguro da sessão/token |
| `expo-crypto` | Geração de IDs únicos (UUID) no momento do cadastro offline — importante desde já, para não haver colisão quando existir sincronização com backend |
| `react-native-paper` | Componentes de UI com estado (botão, campo de texto, etc.) |
| `react-hook-form` + `zod` | Formulários e validação |
| `react-native-svg` | Renderização dos ícones customizados |
| `dayjs` | Manipulação de datas |
| `@expo-google-fonts/big-shoulders` | Fonte de título |

Backend planejado (fora do escopo do app mobile por enquanto): **.NET + PostgreSQL**, com uma versão web para geração de relatórios. Decisão pesou também critério de portfólio, por ser stack comum no mercado europeu.

## 6. Componentes implementados

### 6.1 SplashScreen

Desenvolvido com TDD (teste escrito antes da implementação). Casos cobertos: renderização do logo, do nome do app, do spinner de carregamento e do texto de verificação de sessão.

### 6.2 Ícones da barra de navegação — estado ativo/inativo

Testamos usar só diferença de cor entre aba ativa e inativa, mas o contraste medido entre as duas cores (verde da marca vs. cinza-esverdeado do texto secundário) era de apenas 1.38:1 — próximo demais para diferenciar com traço fino, e clarear a cor inativa pra separar mais comprometeria a legibilidade sob sol forte (mesmo motivo da seção 3.1). Solução adotada: a aba ativa troca o ícone de contorno por uma versão preenchida (sólida) — a diferenciação passa a depender da forma/quantidade de traço, não só da cor, e assim funciona igual em qualquer condição de luz.

### 6.3 Barra de abas (Tabs)

Barra de navegação inferior (Rebanho, Escanear, Histórico, Perfil) via `<Tabs>` do Expo Router. O efeito de toque padrão do Android (ripple cinza) foi customizado para usar a cor da marca, via `tabBarButton` + `android_ripple` (a opção documentada em versões mais antigas do React Navigation, `tabBarPressColor`, não existe na versão vendorizada pelo Expo Router usada aqui).

## 7. Problemas técnicos encontrados e soluções

Registro dos problemas reais de configuração/ambiente resolvidos durante o desenvolvimento — parte do processo normal de trabalhar com um ecossistema (Expo/React Native/Jest) que muda rápido e cuja documentação nem sempre acompanha:

| Problema | Causa raiz | Solução |
|---|---|---|
| `describe`/`it`/`expect` "não existem" no editor | `tsconfig.json` não incluía os tipos do Jest automaticamente | Adicionado `"types": ["jest"]` em `compilerOptions` |
| Teste trava em "`render` function has not been called" | `render()` do `@testing-library/react-native` v14 é assíncrono (versões antigas eram síncronas) | `await render(...)`, com o `beforeEach`/`beforeAll` marcado `async` |
| Mesmo erro, mesmo com `await` | `SafeAreaView` sem um `SafeAreaProvider` ancestral lança erro — no teste, o componente é renderizado isolado, sem o Provider que existe na árvore real do app | Envolver o `render()` do teste com `<SafeAreaProvider initialMetrics={...}>` |
| `getByRole("progressbar")` não encontra o `ActivityIndicator` | O componente nativo do React Native não define `accessibilityRole` sozinho (informação incorreta passada anteriormente) | Adicionar `accessibilityRole="progressbar"` explicitamente **e** usar `testID` como estratégia de busca no teste (o `getByRole` segue sem funcionar de forma confiável nessa combinação de versões) |
| Fonte customizada carregada mas sem efeito visual | `fontWeight` combinado com `fontFamily` de peso fixo faz o Android tentar sintetizar uma variante "bold" que não existe, e cai no fallback do sistema — em silêncio, sem erro | Remover `fontWeight` quando o `fontFamily` já é um peso específico (ex.: ExtraBold) |
| Jest não encontra o módulo `expo-modules-core` | Dependência instalada, mas não promovida (hoisted) para a raiz do `node_modules` pelo npm | Adicionada como dependência direta do projeto |
| `tabBarPressColor` não existe (erro de tipo) | Opção existe em versões antigas do `@react-navigation/bottom-tabs`, mas o Expo Router usa sua própria cópia vendorizada, sem essa opção | Customizar via `tabBarButton` + `android_ripple` diretamente |

## 8. Escopo e prazo

Prioridade definida: ter o **app mobile funcional até o final de outubro de 2026**. O backend em .NET e o sistema web de relatórios ficam para uma etapa posterior, fora desse prazo.

## 9. Próximos passos

- Implementação da tela Meu Rebanho (lista de animais)
- Persistência local (schema Drizzle)
- Fluxo de escaneamento de brinco e cadastro de animal
- Fluxo de transferência de brinco
- Integração com backend (.NET + PostgreSQL) quando existir

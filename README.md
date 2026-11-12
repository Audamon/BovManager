# BovManager

App de gerenciamento de rebanho bovino: leitura do QR code do brinco do animal, cadastro, transferência de brinco entre animais e histórico de saúde/vacinação. Pensado pra uso no campo — offline-first e com paleta ajustada pra legibilidade em sol forte.

> Projeto em desenvolvimento inicial (trabalho de faculdade / portfólio).

## Autor

João Alfredo Tamagno — graduando, Centro Universitário da Serra Gaúcha (FSG).
E-mail: joao.alfredo@leankeep.com.br

## Funcionalidades

- Login, criação de conta, recuperação e troca de senha, logout
- Escanear brinco (QR code) pela câmera
- Cadastrar um animal novo a partir de um brinco escaneado
- Transferir um brinco de um animal pra outro, com histórico
- Listagem do rebanho com busca, filtros (raça/curral) e status de saúde
- Cadastro de vacinas, com lembrete local agendado pra data prevista
- Histórico de eventos do rebanho (transferências, vacinas, saúde)
- Perfil do usuário, com nome da fazenda e modo claro/escuro

## Stack

- [Expo Router](https://docs.expo.dev/router/introduction/) + React Native 0.86 + React 19 + TypeScript
- [React Native Paper](https://callstack.github.io/react-native-paper/) — componentes de UI
- [Drizzle ORM](https://orm.drizzle.team/) sobre `expo-sqlite` — armazenamento local, offline-first
- `expo-camera` — leitura do QR code do brinco
- `expo-secure-store` — sessão/autenticação local
- Futuro: backend em .NET + PostgreSQL, com uma versão web pra geração de relatórios

## Design

A paleta ("Verde Pasto & Terra") mora em [`src/constants/colors.ts`](src/constants/colors.ts) (rampas de cor completas) e [`src/constants/theme.ts`](src/constants/theme.ts) (tokens claro/escuro que a UI consome). Os ícones usados no app estão em [`assets/icons/`](assets/icons/), como SVG.

## Rodando o projeto

```bash
npm install
npm start
```

No terminal do Expo: `a` abre no emulador Android, `w` abre na web, ou escaneia o QR code com o app **Expo Go** no celular (Windows não roda simulador de iOS).

## Testar no celular sem rodar o projeto

Instale o app **Expo Go** (Android, grátis na Play Store) e acesse o link abaixo — ele mostra um QR code pra escanear direto com a câmera ou com o próprio Expo Go:

**https://expo.dev/accounts/audamon/projects/BovManager/updates/d09418d3-3d27-48d6-934e-4a731fd354ab**

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o servidor de desenvolvimento do Expo |
| `npm run android` / `ios` / `web` | Abre direto numa plataforma específica |
| `npm run lint` / `lint:fix` | ESLint (checa / corrige automaticamente) |
| `npm run format` / `format:check` | Prettier (formata / só confere) |
| `npm test` / `test:watch` | Roda os testes (Jest + Testing Library) |

## Estrutura

```
src/
  app/            # rotas (Expo Router)
    (auth)/       # login, cadastro de conta, recuperação de senha
    (app)/        # área logada
      (tabs)/     # Rebanho, Escanear, Histórico, Perfil
  components/     # componentes reutilizáveis
  constants/      # paleta de cores e tokens de tema
  db/             # schema e client do SQLite (Drizzle ORM)
  hooks/          # hooks compartilhados
  services/       # auth e notificações, atrás de uma interface trocável
assets/
  icons/          # ícones SVG usados no app
  images/         # ícones do app, splash, etc.
artigo/
  Artigo_BovManager.pdf   # artigo científico (entrega)
  qrcodes-teste/          # QR codes gerados pra teste manual
evidencias/
  README.md               # legenda de cada screenshot
  *.jpg                   # screenshots reais do app rodando no aparelho
```

## Material de entrega

- **Aplicativo**: este repositório; instruções de execução/demonstração nas seções acima.
- **Artigo científico (PDF, 6–10 páginas)**: [`artigo/Artigo_BovManager.pdf`](artigo/Artigo_BovManager.pdf).
- **Evidências do funcionamento**: as figuras do artigo mostram o mockup usado como guia visual, não o app rodando — os screenshots reais do aparelho estão em [`evidencias/`](evidencias/).
- **Código-fonte**: este repositório (GitHub), organizado por pastas conforme a estrutura acima.

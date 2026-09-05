# BovManager

App de gerenciamento de rebanho bovino: leitura do QR code do brinco do animal, cadastro, transferência de brinco entre animais e histórico de saúde/vacinação. Pensado pra uso no campo — offline-first e com paleta ajustada pra legibilidade em sol forte.

> Projeto em desenvolvimento inicial (trabalho de faculdade / portfólio).

## Funcionalidades

- Login / criação de conta
- Escanear brinco (QR code) pela câmera
- Cadastrar um animal novo a partir de um brinco escaneado
- Transferir um brinco de um animal pra outro, com histórico
- Listagem do rebanho com status de saúde (saudável / doente)
- Histórico de eventos do rebanho (transferências, vacinas, saúde)
- Perfil do usuário

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
    (auth)/       # login, criar conta — fora da área logada
    (app)/        # área logada
  components/     # componentes reutilizáveis
  constants/      # paleta de cores e tokens de tema
  hooks/          # hooks compartilhados
assets/
  icons/          # ícones SVG usados no app
  images/         # ícones do app, splash, etc.
```

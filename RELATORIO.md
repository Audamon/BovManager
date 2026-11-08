# Relatório de Desenvolvimento — BovManager

> Documento de acompanhamento do desenvolvimento do projeto, atualizado conforme novas etapas são concluídas. Serve como registro técnico das decisões tomadas, do que foi implementado e dos problemas resolvidos ao longo do caminho.
>
> O artigo científico exigido pela disciplina (estrutura ABNT, 7 a 10 páginas) está em `artigo/Artigo_BovManager.docx`, escrito com base neste relatório. As capturas de tela do artigo (seção "Protótipo e telas principais") vêm do mockup de design original (renderizado em HTML e fotografado com Chrome headless), não de screenshots do app rodando de verdade — a implementação final segue esse mockup de perto, com as simplificações já documentadas nas seções 6.13 a 6.17. Se quiser trocar por capturas reais do app em execução, é só substituir os PNGs em `artigo/` pelos prints de tela e gerar o documento de novo.

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
  _layout.tsx      # raiz — PaperProvider + SafeAreaProvider, envolve tudo
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

O `_layout.tsx` de raiz existe porque tanto o `SafeAreaProvider` quanto o `PaperProvider` precisam envolver **toda** a árvore de telas uma única vez — abrir um desses providers dentro de cada tela individualmente (como foi feito inicialmente no Splash/Login) funciona, mas duplica a medição de área segura à toa e não escala conforme mais telas são criadas.

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
| `@expo/vector-icons` | Necessário pro `react-native-paper` desenhar seus ícones internos no ambiente gerenciado da Expo (ver seção 7) |

`react-native-paper` está configurado com tema próprio (cores da marca sobrepostas ao `MD3LightTheme` padrão) e ícone customizado via `PaperProvider`, na raiz do app (`src/app/_layout.tsx`).

Backend planejado (fora do escopo do app mobile por enquanto): **.NET + PostgreSQL**, com uma versão web para geração de relatórios. Decisão pesou também critério de portfólio, por ser stack comum no mercado europeu.

## 6. Componentes implementados

### 6.1 SplashScreen

Desenvolvido com TDD (teste escrito antes da implementação). Casos cobertos: renderização do logo, do nome do app, do spinner de carregamento e do texto de verificação de sessão.

### 6.2 Ícones da barra de navegação — estado ativo/inativo

Testamos usar só diferença de cor entre aba ativa e inativa, mas o contraste medido entre as duas cores (verde da marca vs. cinza-esverdeado do texto secundário) era de apenas 1.38:1 — próximo demais para diferenciar com traço fino, e clarear a cor inativa pra separar mais comprometeria a legibilidade sob sol forte (mesmo motivo da seção 3.1). Solução adotada: a aba ativa troca o ícone de contorno por uma versão preenchida (sólida) — a diferenciação passa a depender da forma/quantidade de traço, não só da cor, e assim funciona igual em qualquer condição de luz.

### 6.3 Barra de abas (Tabs)

Barra de navegação inferior (Rebanho, Escanear, Histórico, Perfil) via `<Tabs>` do Expo Router. O efeito de toque padrão do Android (ripple cinza) foi customizado para usar a cor da marca, via `tabBarButton` + `android_ripple` (a opção documentada em versões mais antigas do React Navigation, `tabBarPressColor`, não existe na versão vendorizada pelo Expo Router usada aqui).

### 6.4 AppHeader

Cabeçalho reutilizável (usado no Rebanho, e futuramente Histórico/Perfil), construído sobre o `Appbar` do React Native Paper (`Appbar.Header` + `Appbar.BackAction` + `Appbar.Content`) em vez de um `View` customizado do zero — já resolve estado de toque, acessibilidade e o layout clássico "voltar / título / ação" sem reinventar isso à mão. Props: `title`, `subtitle`, `leftIcon`, `rightIcon`, `onBackPress` (a seta de voltar só aparece se essa prop for passada).

### 6.5 Rebanho — estado vazio (EmptyState)

Primeiro dos três estados da tela (vazio/carregando/populado) implementado, também com TDD. Ícone, título, subtítulo e botão "Escanear brinco" (usando `Button` do Paper, com o `QrcodeIcon` customizado plugado via a prop `icon`).

### 6.6 Rebanho — estado de carregando (LoadingState)

Segundo estado da tela: 4 cards de skeleton (ícone falso + duas "cápsulas" de texto falso, em tons neutros do tema), com efeito de pulsação de opacidade via `Animated` do React Native — sem lib externa nenhuma (conferimos a lista completa de componentes do Paper antes: não existe nada de skeleton/placeholder de carregamento lá).

### 6.7 IconBadge

Componente mínimo extraído durante o Rebanho: um ícone dentro de uma caixa arredondada com fundo tintado. Reutilizado no `AppHeader` e no `RebanhoCard`. Decidimos **não** extrair um componente maior (tipo um "card genérico" compartilhado entre Rebanho e Histórico) — os dois usam ícone à esquerda, mas alinhamento e altura do card já divergem o suficiente pra um componente único virar uma pilha de props de exceção; só o badge do ícone valia a extração.

### 6.8 StatusBadge

Selo de status do animal (Saudável/Doente) ou texto simples sem selo (Sem pendências) — a própria presença da prop `badgeColor` decide qual das duas variantes aparece, sem uma prop `hasBadge` separada (mesma ideia do `onBackPress` do `AppHeader`: presença da prop já é o sinal, evita as duas props contradizerem uma à outra). Tamanho, peso de fonte e arredondamento ficaram fixos dentro do componente — não viraram prop, pra garantir que todo selo do app tenha a mesma cara.

### 6.9 Rebanho — estado populado (LoadedState + RebanhoCard)

Terceiro e último estado da tela. O card de cada animal (`RebanhoCard`) virou componente próprio desde o início, pensando na lista real vir de um `.map()` sobre os dados depois — os 3 cards de exemplo no `LoadedState` já são só chamadas desse componente com dados diferentes.

O status do animal é tipado (`AnimalStatus`, em `src/types/animal.ts`) como união de valores fixos (`"saudavel" | "doente" | "atencao" | "semPendencias"`), não `string` livre — motivado por um bug real que isso evita (ver seção 7). Duas funções (`getStatusColor`, `getStatusText`) fazem `switch` sobre esse tipo pra decidir cor e texto exibido, com responsabilidades separadas.

### 6.10 Botão flutuante "Escanear" (FloatingButton)

`FAB` do React Native Paper no canto inferior direito do Rebanho, na cor de destaque (`theme.secondary`) e com o `QrcodeIcon` customizado. Navega para a tela de escanear com `router.navigate("/escanear")`. As telas de Histórico e Perfil também ganharam uma estrutura base nessa etapa.

### 6.11 Escanear — permissão de câmera (AskPermission) e ScanHeader

A permissão de câmera é declarada no `app.json` (plugin do `expo-camera`, com a mensagem exibida pelo sistema) e consultada em tempo de execução com `useCameraPermissions()`. Enquanto ela não é concedida, a tela mostra o componente `AskPermission`: ícone de câmera cortada (`CameraOffIcon`), título, texto explicativo e um botão "Pedir Permissão" que chama `requestPermission`.

O cabeçalho da tela virou um componente próprio, o `ScanHeader`, também sobre o `Appbar` do Paper: seta de voltar (`ArrowBackIcon`), título "Escanear Brinco" e, opcionalmente, o botão de flash (`FlashIcon`, ativado pela prop `showFlashIcon`). A cor de fundo é configurável (`backgroundColor`): sólida na tela de permissão e escura semitransparente por cima da câmera.

### 6.12 Escanear — leitura do QR code e resultado

A câmera (`CameraView`) lê só QR codes (`barcodeScannerSettings={{ barcodeTypes: ["qr"] }}`) e fica ligada apenas enquanto a tela está em foco (`useIsFocused`). Por cima dela há uma máscara escura com o visor recortado no centro e a dica "Aponte a câmera para o QR code do brinco".

O resultado da leitura é um estado tipado como união discriminada: `ScanResult = idle | found (com o animal) | notFound (com o nº do brinco lido)`. Assim cada bloco de resultado só existe quando há os dados de que precisa. O QR code guarda apenas o número do brinco como texto, e a busca do animal (`buscarAnimalPorBrinco`) ainda é uma simulação com uma lista local, até a persistência existir.

Decisões:

- **Trava de leitura (`scanLock`)**: a câmera dispara dezenas de leituras por segundo com o mesmo QR. Um `useRef` trava o processamento após a primeira leitura, e o `onBarcodeScanned` só fica ligado enquanto o estado é `idle`. A próxima leitura só é liberada por um reset explícito, para o resultado não ficar trocando enquanto o usuário interage com ele.
- **Reset ao sair da tela**: telas de aba não são desmontadas ao trocar de aba, então o resultado do último scan ficava preso. O reset roda no cleanup de um `useFocusEffect` (ver seção 7).
- **Blocos de resultado subindo da parte de baixo**: `Animated.View` do `react-native-reanimated` com as layout animations `SlideInDown`/`SlideOutDown`. O bloco anima sozinho ao ser montado e desmontado, sem controlar valores de animação à mão nem usar uma lib de bottom sheet. Por enquanto os blocos são placeholders ("Animal encontrado!" / "Animal não encontrado!"); o conteúdo final segue o mockup (seção 3.3).
- **Teste com câmera real**: no celular, pelo Expo Go (o projeto não usa `expo-dev-client`), lendo QR codes gerados com o texto do brinco (`0321-BR` existe no mock, `0417-BR` não) e exibidos no monitor.

As telas de Histórico e Perfil, por enquanto, seguem só com `AppHeader` + texto de placeholder (`"Conteúdo do histórico"` / `"Conteúdo do perfil"`) — o conteúdo real delas fica pra depois da persistência local existir.

### 6.13 Persistência local (Drizzle + expo-sqlite) e telas finais com dados reais

Até aqui o app inteiro rodava sobre dados inventados: uma lista fixa de três animais no `LoadedState`, uma busca simulada no Escanear, textos de placeholder no Histórico e no Perfil. Essa etapa junta duas coisas que precisavam acontecer juntas — criar a persistência de verdade e trocar cada um desses mocks pelo dado real — porque não fazia sentido ligar as telas umas às outras antes de ter onde gravar.

**Por que Drizzle + expo-sqlite, e não outra coisa.** O app é offline-first por definição do próprio projeto (ver seção 1): o produtor usa no curral, sem sinal. Isso descarta qualquer solução que dependa de rede pra funcionar (Firebase, REST contra um servidor etc.) — o banco precisa morar no aparelho. `expo-sqlite` é o banco embarcado oficial do Expo; `drizzle-orm` foi escolhido por cima dele por dar tipagem estática nas consultas (o TypeScript sabe, em tempo de compilação, que `animals.earRing` é `string` e `animals.weight` é `number | null`), evitando o tipo de erro silencioso que já tinha acontecido antes com o `status` do animal sendo `string` livre (ver a tabela de problemas na seção 7).

- **Schema** (`src/db/schema.ts`): uma única tabela `animals` (brinco, raça, sexo, nascimento, peso, status, foto, data de cadastro). `status` reaproveita o mesmo union type `Animalstatus` que já existia no `RebanhoCard`, em vez de criar um tipo novo e duplicado — se um dia esse union mudar (por exemplo, ganhar um novo status de saúde), muda num lugar só e o TypeScript aponta todo mundo que precisa ser ajustado.
- **Cliente** (`src/db/client.ts`): `drizzle-orm/expo-sqlite` sobre `openDatabaseSync` — o driver é **síncrono** (`.all()`/`.get()`/`.run()`, sem `await`), diferente da maioria dos exemplos de Drizzle que se encontra por aí (voltados a servidores Node, assíncronos). Essa escolha não foi incidental: o resto do app já era síncrono por natureza (`handleScan` no scanner, por exemplo, processa o código lido e decide o resultado no mesmo tick), então um driver assíncrono ia forçar `async`/`await` espalhado por componentes que não precisavam disso. A criação da tabela é um `CREATE TABLE IF NOT EXISTS` direto no boot do app (função `initDb()`, chamada uma única vez no `_layout.tsx` raiz, fora do ciclo de vida de qualquer tela) — um atalho consciente no lugar do fluxo completo de migrações versionadas do `drizzle-kit` (que geraria arquivos `.sql` de migração e um histórico aplicado a cada boot). A troca: setup imediato, sem gerar/revisar arquivos de migração a cada mudança de schema; o custo: evoluir o schema depois exige lembrar de ajustar o `CREATE TABLE`/`ALTER TABLE` manualmente (foi exatamente o que aconteceu na seção 6.16, com o campo de localização).
- **Cadastro de animal** (`cadastro.tsx`): formulário fechado com `react-hook-form` + `zodResolver` — brinco, raça, data de nascimento, peso, sexo (`SegmentedButtons`) e foto opcional (`ImageInput`, componente novo construído com `expo-image-picker`/`expo-image`). O `zod` valida antes de deixar o `react-hook-form` chamar o `onSubmit`, então campos vazios ou inválidos nunca chegam a tocar no banco. Salvar grava direto na tabela `animals` e volta pra tela anterior (`router.back()`), devolvendo o controle pra quem navegou até o cadastro — a tela de Rebanho ou o fluxo de Escanear.
- **Escanear**: a busca simulada (`buscarAnimalPorBrinco`, que antes comparava contra um array de um item só, escrito na mão) virou uma consulta real: `db.select().from(animals).where(eq(animals.earRing, brinco)).get()`. O botão de voltar do cabeçalho, que ainda estava com a linha comentada (`// onBackPress={() => {}}`), também foi ligado nessa mesma passada.
- **Rebanho**: a lista deixou de ser 3 cards fixos — `LoadedState` agora recebe `animais: Animal[]` como prop e faz o `.map()` sobre o resultado real da consulta. A tela consulta a tabela toda vez que a aba ganha foco (`useFocusEffect`), o que garante que um animal cadastrado agora apareça na lista assim que o usuário voltar pra essa aba, sem precisar de um mecanismo de "atualizar" manual. A busca por texto filtra por nome ou brinco. Como a consulta ao SQLite é síncrona (não tem round-trip de rede pra esperar), o terceiro estado da tela original — "carregando" (`LoadingState`, com os cards de skeleton) — deixou de fazer sentido: a tela já nasce direto em `empty` ou com a lista populada, sem uma fase intermediária de espera pra simular.
- **Histórico**: lista os cadastros feitos, do mais recente pro mais antigo (`orderBy(desc(animals.createdAt))`), reaproveitando o `RebanhoCard` em vez de criar um card novo só pra essa tela. Nessa primeira versão, sem uma tabela de eventos própria, "histórico" ainda era só isso — a versão com eventos de transferência mistos vem na seção 6.14.
- **Perfil**: conteúdo real, mas propositalmente simples nessa primeira passada — nome e versão do app (lidos direto do `app.json`, pra não duplicar essa informação em dois lugares) e um aviso de que login por usuário ainda não existe, já que o portão de sessão segue desativado (seção 4). O conteúdo completo (usuário logado, toggles) só chega na seção 6.15.

**Dois erros corrigidos no caminho, que valem registrar porque não são óbvios:**
- `Date.now()` chamado dentro do corpo do componente de Cadastro disparava o lint `react-hooks/purity` — uma regra nova do React (ligada ao React Compiler) que proíbe chamadas "impuras" (relógio, `Math.random`, etc.) durante o que ela considera fase de render, mesmo quando a chamada só acontece de fato dentro de um `onPress`. O motivo é que o analisador estático não consegue provar, só olhando pro código, que aquela função só roda num evento e nunca durante o render em si. A correção foi extrair a gravação no banco pra uma função comum (`salvarAnimal`), declarada fora do componente — por não ser um componente nem um hook (nome em minúsculo, não começa com `use`), o linter simplesmente não aplica essa regra a ela.
- O tipo do evento que o `handleSubmit` do `react-hook-form` passa pro `onSubmit` (pensado originalmente pra formulários web, `BaseSyntheticEvent`) não batia com o tipo do evento que o `onPress` do `Button` do React Native Paper espera (`GestureResponderEvent`, da API de toque do React Native). A correção foi descartar o evento inteiro na borda: `onPress={() => handleSubmit(onSubmit)()}` — a função anônima ignora o que o `onPress` manda e simplesmente invoca `handleSubmit(onSubmit)` sem argumento nenhum.

**Correção de fluxo (pós-lançamento dessas telas):** o Cadastro só é alcançável a partir do resultado "brinco não encontrado" do Escanear — não existe nenhum outro botão no app que leve até ele. Ainda assim, o campo BRINCO nascia vazio, pedindo pro usuário digitar de novo um número que ele tinha acabado de escanear. Corrigido: `onRegisterNow` (prop do `ScanResultSheet`) passou a receber o brinco lido como argumento; `escanear.tsx` repassa isso como parâmetro de rota (`router.push({ pathname: "/cadastro", params: { earRing } })`); e `cadastro.tsx` lê esse parâmetro com `useLocalSearchParams` e exibe o campo BRINCO como leitura (não editável), já que ele é um dado capturado pela câmera, não digitado pelo usuário. De quebra, corrigido também um texto da tela de "brinco não encontrado" que mostrava sempre `0417-BR` fixo, independente do brinco realmente escaneado.

### 6.14 Detalhe do animal, transferência de brinco e contas de usuário

- **Detalhe do animal** (`animal/[id].tsx`, rota dinâmica): grid com os dados reais do animal, foto, e o histórico de transferências dele (consulta na tabela `transfers`). Os cards do Rebanho e do Histórico passaram a navegar pra cá ao tocar.
- **Transferência de brinco**: simplificado em relação ao mockup original (que previa escanear os dois brincos, origem e novo). Como a transferência sempre parte da tela de detalhe de um animal já conhecido, só é preciso escanear o **novo** brinco — a origem já vem por parâmetro de rota. `transferir.tsx` escaneia e recusa um brinco já usado por outro animal; `transferir-confirmar.tsx` mostra origem → novo, o motivo da troca e grava a mudança (atualiza `animals.earRing` e insere um registro em `transfers`, tabela nova).
- **Histórico**: deixou de ser só a lista de cadastros e virou um feed de eventos (cadastro + transferência, ordenado por data), mais fiel ao mockup original.
- **Contas de usuário**: tabela `users` nova + `src/db/auth.ts` (hash de senha com `expo-crypto`, sessão em `expo-secure-store`). As telas de Login e Cadastro de Conta foram refeitas no estilo do mockup e funcionam de ponta a ponta (criam conta, autenticam). **Decisão confirmada**: por enquanto fica tudo local mesmo (sem backend de autenticação) — isso já satisfaz o requisito do trabalho ("cadastro e autenticação de usuários"), e um backend de verdade fica fora do escopo deste projeto por ora (ver seção 8).

### 6.15 Vacinação e edição do animal

- **Vacinação**: estava na visão geral do projeto (seção 1) desde o início e tinha ficado de fora até agora. Tabela `vaccines` nova (nome, data, se já foi aplicada ou está prevista). Tela de detalhe do animal ganhou o card "Vacinas" com dados reais, e um link "+ Adicionar" que abre `vacina-nova.tsx` (mesmo padrão de formulário do Cadastro).
- **Edição do animal** (`editar-animal.tsx`): o botão "Editar" agora funciona. Decisão sobre o que é editável: nome, raça, sexo, status de saúde, nascimento, peso e foto — tudo isso. **O brinco (earRing) não é editável por aqui**, só aparece como leitura; trocar o brinco continua sendo responsabilidade exclusiva do fluxo de "Transferir brinco" (editar o campo livremente aqui ia abrir uma porta pra mudar o brinco sem deixar rastro no histórico de transferências).
- **Também aproveitado**: `Perfil` ganhou conteúdo real (usuário logado via sessão, fazenda, toggle de modo escuro — esse funcional de verdade, com um `ThemePreferenceProvider` novo e persistência via `expo-secure-store` — e toggle de notificações, esse só visual por enquanto). De quebra, corrigido o bug antigo do `use-theme.ts` (`scheme === 'unspecified'` que nunca batia).

### 6.16 Localização do animal e filtros no Rebanho

- **Localização**: campo que estava na proposta aprovada pelo professor ("consulta... status de saúde e localização de pasto diretamente no curral") mas não existia em lugar nenhum do app. Adicionado em `animals.location` (texto livre, ex. "Pasto 4 — Invernada Norte"), editável no Cadastro e na Edição, exibido no Detalhe do animal. Como a tabela já existia sem essa coluna (sem migração de verdade — ver seção 9), o `initDb()` tenta um `ALTER TABLE animals ADD COLUMN location TEXT` e ignora o erro de "coluna já existe", pra instalações antigas do app ganharem o campo sem perder os dados já cadastrados.
- **Filtros no Rebanho**: dois filtros (menu suspenso) abaixo da busca — por **raça** e por **curral/pasto**. Esse último reaproveita o campo `location` recém-criado (não existe um conceito de "curral" separado no banco). As opções de cada filtro são geradas a partir dos valores que já existem no rebanho cadastrado, não de uma lista fixa.

### 6.17 Camada de autenticação desacoplada, recuperação de senha e notificações de vacina

- **`src/services/auth/`**: a lógica de autenticação, que antes vivia solta em `src/db/auth.ts` chamando o SQLite direto, virou uma interface (`AuthRepository`, em `types.ts`) implementada por `localAuthRepository.ts`. Todo componente (Login, Cadastro de Conta, Perfil) importa só `authRepository` de `src/services/auth/index.ts`, nunca a implementação local diretamente. Quando o backend em .NET existir, a troca é criar um `remoteAuthRepository.ts` com a mesma interface (chamando a API em vez do SQLite) e mudar uma linha só em `index.ts` — nenhuma tela precisa mudar.
- **Recuperação de senha** (`recuperar-senha.tsx`): como o app não tem servidor nem e-mail, a "recuperação" local é direta — informa o e-mail cadastrado e já define a nova senha, sem passo de verificação (não existe como confirmar posse do e-mail sem backend). É uma simplificação proposital, documentada aqui pra não ser confundida com uma falha de segurança despercebida: um fluxo de recuperação de verdade (com token por e-mail) só faz sentido quando existir backend.
- **Logout**: já existia (Perfil), passou a usar `authRepository.logout()`.
- **Notificações de vacina** (`src/services/notifications.ts`, usando `expo-notifications`): quando uma vacina é cadastrada como "prevista" (não aplicada ainda), uma notificação local é agendada pra data informada. O toggle "Notificações" do Perfil agora é funcional de verdade — desligar cancela todas as notificações agendadas, ligar reagenda a partir das vacinas previstas no banco. Limitação conhecida: como o app roda no Expo Go (sem `expo-dev-client`), não dá pra testar isso de forma muito vistosa — a notificação só aparece de fato quando a data agendada chega, não tem como "forçar" uma demonstração imediata sem adiantar o relógio do aparelho.

### 6.18 Portão de sessão reativado

Login, cadastro de conta e recuperação de senha precisavam ser demonstráveis pro professor — não bastava existir, era preciso aparecer no fluxo normal do app. `src/app/index.tsx` passou a checar a sessão de verdade antes de decidir pra onde navegar: chama `authRepository.getCurrentUser()` (assíncrono, por isso o componente guarda o destino num estado e mostra a `SplashScreen` enquanto aguarda) e redireciona pra `/login` se não houver ninguém logado, ou `/rebanho` se já houver uma sessão salva. Antes, essa tela sempre mandava direto pra `/rebanho`, e as telas de autenticação só eram alcançáveis digitando a URL manualmente ou pelo card do Perfil.

Com isso, o ciclo completo fica demonstrável: abrir o app sem conta → tela de Login → "Criar conta" → Cadastro de Conta → volta pro Login → entra → usa o app → Perfil → Sair → volta pro Login. "Esqueci minha senha" continua acessível a partir do Login, levando pra `recuperar-senha.tsx` (seção 6.17), que já funcionava, só não tinha como ser alcançada de forma óbvia antes do portão existir.

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
| Digitação errada no `status` de um animal ("saúdavel" em vez de "saudável") fazia o selo de status não aparecer, em silêncio | `status` era `string` livre — o TypeScript não tinha como pegar o erro de digitação | Trocado por um union type (`AnimalStatus`), exportado de um lugar só e usado em todo componente que lida com status — agora um valor errado vira erro de compilação, não bug silencioso |
| Texto/ícone branco em cima de um selo/cabeçalho colorido fica escuro no modo escuro | Usar `theme.surface` querendo dizer "branco fixo" — `surface` é a cor de fundo de card, que corretamente escurece no modo escuro; não é a mesma coisa que "cor de texto sobre um elemento colorido" | Usar `COLORS.surface` (fixo, sempre branco) nesses casos, não `theme.surface`; reservar tokens do tema pra coisa que deve mesmo mudar de cor com o tema |
| Badge do ícone "sem fundo" dentro do card, só no modo escuro | `backgroundElement` e `surface` apontavam pro mesmo degrau da rampa (`neutral[800]`) no tema escuro — o badge tecnicamente tinha cor, só que idêntica à do card atrás dele | Separar os dois em degraus diferentes da rampa no `Colors.dark` |
| Cabeçalho fixo (cor de marca, não muda com tema) parecia destoar do resto do app no modo escuro | Trade-off real, não bug: cabeçalho fixo e vívido ao lado de conteúdo/tab bar que escurecem junto pode parecer inconsistente | Decisão de design, não técnica — mantido fixo (`COLORS.primary`) por preferência, depois de comparar com a versão adaptável (`theme.primary`) lado a lado |
| Ícone customizado renderiza pequeno/invisível (aconteceu com `UserIcon`, `ClockIcon` e `QrcodeIcon`, em momentos diferentes) | O componente recebe `width`/`height` como prop mas nunca aplica isso no `<Svg>` (falta `style={{ width, height }}`) — sem tamanho explícito, o SVG não tem de onde puxar suas dimensões | Sempre aplicar `style={{ width, height }}` no `<Svg>` — virou item de checklist ao criar um ícone novo |
| Suíte de teste inteira falha com "Jest encountered an unexpected token" apontando pro `global.css` | `theme.ts` importa `global.css` (usado só no build web); o Jest tenta interpretar esse arquivo como JavaScript e quebra na primeira regra CSS | `moduleNameMapper` no `jest.config.js` mapeando `.css` pra um mock vazio (`__mocks__/styleMock.js`) |
| Componente renderiza "vazio" no teste (nenhum filho na árvore), mesmo sem usar nada de área segura | `<SafeAreaProvider>` sem `initialMetrics` esconde **todos** os filhos da árvore de consulta no ambiente de teste — não é só quem chama `useSafeAreaInsets`/`SafeAreaView`, é qualquer coisa dentro do Provider | Todo teste que usa `SafeAreaProvider` já nasce com `initialMetrics` preenchido, mesmo que o componente testado não use área segura |
| Conteúdo não centraliza verticalmente na tela, mesmo com `flex: 1` no container certo | `flex: 1` só funciona se **toda a cadeia de pais**, até a raiz da tela, também participar do layout flex — faltava `style={{ flex: 1 }}` no `SafeAreaView` mais externo da tela | Aplicar `flex: 1` em cada nível da árvore que precisa esticar, não só no container mais interno |
| Ícone do Paper aparece como quadrado vazado (glifo não carrega) | O ícone padrão do Paper depende da fonte do Material Community Icons, que não vem linkada por padrão num projeto Expo gerenciado | Configurar `PaperProvider` com `settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}`, usando `@expo/vector-icons` |
| `Appbar.Content`'s `subtitle` com aviso de depreciado | Material Design 3 (que o Paper v5 segue) removeu o padrão de duas linhas no app bar | Passar um `View` com dois `Text` customizados como `title`, já que essa prop aceita qualquer `React.ReactNode` |
| Texto não quebra linha, fica todo numa linha só | `Text` sem `maxWidth`/`width` não tem limite pra forçar a quebra, principalmente dentro de um container que encolhe pro tamanho do conteúdo (`alignItems: "center"`) | Definir `maxWidth` (fixo ou em `%`) no estilo do texto |
| `Error: Cannot access refs during render` ao inicializar um `Animated.Value` com `useRef(...).current` | O React 19 passou a proibir ler `.current` de um ref durante a fase de render — mesmo o padrão clássico de "inicializar só uma vez" que funcionava até a v18 | Trocar por `useState(() => new Animated.Value(1))` (o inicializador preguiçoso do `useState` também roda só uma vez, sem mexer em ref) |
| Câmera abre mas não reage a nenhum QR code (nem válido, nem inválido) | A função de leitura existia, mas não estava ligada ao `CameraView`; ao ligar, foi usado o nome antigo `onBarCodeScanned` (do extinto `expo-barcode-scanner`) | Usar a prop `onBarcodeScanned`, com "c" minúsculo, que é o nome no `CameraView` do `expo-camera` |
| Bloco de resultado aparece como um retângulo branco vazio | Texto em `color: "white"` sobre o fundo branco do bloco | Usar cor de texto escura (ou o token de texto do tema) |
| Bloco de resultado fica preso acima da barra de abas | O conteúdo de uma aba termina onde a barra de abas começa; o `bottom: 0` do bloco encosta nela, não no fundo da tela | Barra escondida na tela de Escanear via `tabBarStyle: { display: "none" }` na própria `Tabs.Screen` (mesmo recurso usado depois no Cadastro, que também é tela cheia) |
| `router.back()` não voltava da tela de Escanear pra aba anterior | Troca de aba não é, por padrão, uma entrada no histórico de navegação do `Tabs` — não tem "tela anterior" pra desempilhar | `backBehavior="history"` no `<Tabs>` raiz, fazendo o navigator registrar a sequência de abas visitadas |
| `TextInput` do Paper ignorava `borderRadius` passado no `style` | No `mode="outlined"`, a borda é desenhada por um elemento interno separado, que só lê a prop própria `outlineStyle` — `style` afeta só o container externo | Usar `outlineStyle={{ borderRadius: ... }}` em vez de `style.borderRadius` |
| Card de resultado "found" não mudava de cor no modo escuro | `theme.surface` é literalmente branco por definição no tema claro — a mudança de cor estava correta, só não visível nesse teste específico | Não era bug: `theme.surface` é branco de propósito no claro e escurece no escuro; confirmado testando com outro token |
| Resultado do scan anterior continua na tela ao sair e voltar | Telas de aba não são desmontadas ao trocar de aba, então o estado do componente sobrevive | Resetar o estado no cleanup de um `useFocusEffect`, que roda quando a tela perde o foco |
| ESLint acusa "Calling setState synchronously within an effect" ao resetar o estado num `useEffect` observando `isFocused` | Regra do plugin de hooks do React contra `setState` síncrono no corpo de um efeito (causa renders em cascata) | Mover o reset para a função de limpeza do `useFocusEffect` |

## 8. Escopo e prazo

Prioridade definida: ter o **app mobile funcional até o final de outubro de 2026**. Conferindo a descrição oficial do projeto (a que foi aprovada pelo professor), os requisitos mínimos — interface, cadastro e autenticação de usuários, funcionalidade principal, protótipo navegável, modelagem básica e descrição das tecnologias — não exigem backend remoto nenhum; um app funcional com persistência local (SQLite) já atende. Por isso, login/cadastro de usuário continuam **só locais** (sem servidor de autenticação) de propósito, não por falta de tempo. Um backend em .NET + PostgreSQL e um sistema web de relatórios seguem como ambição pessoal/portfólio, fora do escopo exigido por este trabalho.

## 9. Próximos passos

Nada do que está nesta lista é requisito do trabalho — é o que ficaria pra uma eventual continuação do projeto fora da disciplina:

- **Migrações de verdade** com `drizzle-kit`, no lugar do `CREATE TABLE IF NOT EXISTS`/`ALTER TABLE` direto usado por enquanto (seções 6.13 e 6.16)
- **QR code em baixo-relevo (impressão 3D)** — a proposta prevê identificação por QR codes em baixo-relevo, sem tinta/contraste de cor. A leitura foi testada só com QR impresso normal (tela/papel); um QR em relevo tende a ser bem mais sensível a ângulo e iluminação, e isso ainda não foi validado com a peça física
- Integração com backend (.NET + PostgreSQL) e sistema web de relatórios, caso o projeto continue além da disciplina

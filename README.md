# WIZDOM

**Seu futuro, no seu ritmo.** Protótipo interativo e responsivo de uma plataforma acolhedora para vestibulandos, com a identidade visual do guia WIZDOM.

![Dashboard da WIZDOM](docs/dashboard.png)

## Executar

Requer Node.js 20.19+ ou 22.12+ (validado com **24.22.1**) e npm.

```sh
npm ci
npm run dev
```

Para gerar e servir a versão de produção:

```sh
npm run build
npm run preview
```

Não exige chaves, banco de dados ou serviços externos. Fontes e ícones são servidos localmente.

## Experimentar

A página inicial abre uma demonstração. Clique em **Criar minha conta** para experimentar o fluxo completo com dados fictícios e uma senha de teste:

1. Cadastro e questionário de três etapas: curso, ingresso, escolaridade, matérias, frequência, rotina, horas e dias disponíveis.
2. Dashboard e cronograma personalizados. O check-in de cansaço/sobrecarga reduz o plano para até 25 minutos de uma matéria favorita, com uma mensagem acolhedora.
3. Área de foco com Pomodoro de 30/5 minutos, temporizador ou cronômetro. A sessão ocupa a interface, permite pausas e saída explícita. Cada minuto completo efetivamente estudado rende **4 XP e 2 moedas**. Descanso não rende pontos. A cada **100 XP**, um novo nível.
4. Perfil com bio, foto e banner locais, gráfico de horas reais, meta e corujinha personalizável. Novas cores podem ser resgatadas com moedas e desbloqueadas por nível.
5. Vestibulares com filtros por curso, instituição e região, notas/ingressos/datas de exemplo e links oficiais. Favoritar adiciona a abertura de inscrições ao calendário interno.
6. Olimpíadas por área, com distinção para estudantes do ensino médio; ranking opcional com colegas fictícios; flashcards de exemplo que agendam revisões para amanhã ou três dias depois.

Os dados de cada conta são separados dos dados da demonstração e persistem neste navegador. Ao atualizar uma sessão de foco, ela é recuperada **em pausa** quando a área de foco é aberta, sem contar o tempo ausente.

## Validação

```sh
npm test          # regras de planejamento e isolamento de estado
npm run test:e2e # inicia servidor isolado e testa os fluxos em Chromium
npm run build
```

O teste E2E usa `/usr/bin/chromium` por padrão. Em outra máquina, defina `CHROMIUM_PATH` com o executável instalado. É possível fornecer `BASE_URL` para testar um servidor existente, ou `WIZDOM_TEST_PORT` para trocar a porta do servidor isolado (padrão: 5175). Os contextos de teste são descartáveis e não alteram seus dados de demonstração.

Os testes de foco usam o relógio virtual do Playwright para verificar 30 minutos de estudo e pausas sem aguardar esse tempo real.

## Escopo deste protótipo

- **Cadastro/login demonstrativos locais**: senhas de teste são derivadas com PBKDF2/SHA-256 e salt individual; não há autenticação segura em servidor, recuperação de senha, envio de e-mails ou sincronização. Não use senhas reais nem dados sensíveis.
- **Datas e notas de corte são ilustrativas**, não são informações atuais nem recomendações de inscrição. O app exibe esse aviso e aponta para os portais oficiais. Ingresso, campus, modalidade, cotas e ano podem alterar os requisitos.
- **Ranking demonstrativo**, sem compartilhamento de dados de alunos. Nenhum dado pessoal é publicado.
- O calendário é interno; não envia notificações externas nem integra Google Calendar.
- O plano usa regras explicáveis de disponibilidade/preferência/check-in; não diagnostica condições psicológicas. Métricas de estudo são registradas a partir das sessões concluídas; tarefas marcadas manualmente não concedem XP.
- Fotos locais aceitam JPG, PNG ou WebP de até 350 KB cada. Para apagar dados, limpe o armazenamento deste site no navegador.
- Próximas etapas para produção: backend com autenticação, privacidade e proteção de menores, catálogo oficial atualizado, consentimento e notificações, conteúdo pedagógico e validação do planejamento com estudantes.

## Estrutura

- `src/App.jsx`: navegação, estado local por conta e integração das páginas.
- `src/lib.js`: planejamento, perfil inicial e derivação de senha de demonstração.
- `src/Auth.jsx`, `src/Onboarding.jsx`: acesso e personalização inicial.
- `src/Dashboard.jsx`: plano diário, check-in, calendário e progresso.
- `src/pages/`: foco, perfil, ranking, vestibulares, calendário e olimpíadas.
- `src/styles.css`: tokens do guia visual, componentes comuns, dashboard e responsividade.
- `tests/`: testes de regras e fluxos completos de navegador.

Paleta: fundo `#FAF9FC`, superfícies brancas, texto `#373743`, secundário `#666673`, borda `#E8E5ED`, ação `#625B85`. Pastéis de apoio do guia: rosa, azul, menta, pistache, lavanda e pêssego. A interface oferece foco visível, controles de conforto, navegação por teclado e respeito a movimento reduzido.

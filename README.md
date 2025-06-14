# Gerente de Loja

Aplicação mobile desenvolvida com **React Native** usando o framework **Expo**. O projeto tem como objetivo auxiliar o gerenciamento das lojas da rede, disponibilizando trilhas de treinamento em vídeo, check lists de atividades e um sistema de ranking de desempenho para os colaboradores.

## Principais Funcionalidades

- **Autenticação** de usuários utilizando o Firebase Authentication;
- **Trilhas de Treinamento** (fixas e semanais) com controle de progresso;
- **Check List** integrado à câmera do dispositivo;
- **Ranking** de pontuação dos colaboradores;
- Área de **cadastro** de vídeos e trilhas (acesso restrito para administradores);
- Integração com Firestore e Storage para salvar dados e vídeos.

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/);
- [TypeScript](https://www.typescriptlang.org/);
- [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage e Functions);
- [React Navigation](https://reactnavigation.org/) para a navegação entre telas;
- [Tailwind](https://tailwindcss.com/) via NativeWind para estilização;
- Outras bibliotecas auxiliares como Moti, Lottie, React Native Reanimated, entre outras.

## Pré‑requisitos

- [Node.js](https://nodejs.org/) (recomenda‑se a versão 16 ou superior);
- Gerenciador de pacotes [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/);
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalada globalmente ou via `npx`.

## Instalação e Execução

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Inicie o aplicativo em modo de desenvolvimento:
   ```bash
   npx expo start
   ```
   O Expo exibirá um QRCode para abrir o app em um dispositivo físico ou emulador.

## Scripts Úteis

- `npm run lint` – executa a verificação de lint via Expo;
- `npm test` – executa os testes com Jest;
- `npm run android` ou `npm run ios` – abre o app diretamente no emulador Android ou iOS.

## Estrutura do Projeto

```
src/
  app/                   # ponto de entrada da aplicação
  assets/                # imagens e recursos estáticos
  components/            # componentes reutilizáveis
  hook/                  # hooks personalizados
  routes/                # configurações de navegação
  screens/               # telas principais
  services/              # configurações do Firebase e serviços
  styles/                # arquivos de estilo
  types/                 # definições de tipos e interfaces
```

Os arquivos de configuração do Expo e do Firebase ficam na raiz do projeto.

## Build para Produção

Para gerar builds para distribuição, utilize o [EAS CLI](https://docs.expo.dev/eas/). Exemplo para Android:

```bash
npx eas build --platform android
```

Antes de gerar builds é necessário possuir uma conta no Expo e configurar as credenciais das lojas (Play Store/App Store).

## Contribuindo

1. Faça um fork deste repositório;
2. Crie uma branch para a sua funcionalidade: `git checkout -b minha-feature`;
3. Commit suas alterações: `git commit -m "feat: minha feature"`;
4. Envie a branch: `git push origin minha-feature`;
5. Abra um Pull Request.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.


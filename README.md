# NexoPDV - Aplicativo WebView

Este é um aplicativo Android que carrega o sistema Nexo PDV através de um WebView.

## Características

### 1. Interface de Usuário
- **Tela de Carregamento (Splash Screen)**: 
  - Fundo com a cor #131b2e
  - Nome "ema software" com a fonte MuseoModerno
  - Texto em azul claro (#4FC3F7)
  - Indicador de carregamento abaixo do nome

- **Ícone do Aplicativo**: 
  - Fundo com a cor #131b2e
  - Desenho de uma caixa registradora em contorno branco, sem preenchimento
  - Design minimalista com linhas simples

### 2. Funcionalidades
- **Carregamento do Sistema**: Carrega automaticamente a URL https://nexopdv.emasoftware.io/login
- **Verificação de Conexão**: Verifica se há conexão com a internet antes de tentar carregar a página
- **Tratamento de Erros**: 
  - Exibe uma tela informativa quando não há conexão
  - Botão "Tentar novamente" para verificar a conexão
  - Redireciona para a tela de sem conexão se ocorrer algum erro durante o carregamento

### 3. Requisitos Técnicos
- **Compatibilidade**: Android 5.0 (API 21) e superior
- **Permissões**: 
  - Internet
  - Acesso ao estado da rede

## Estrutura do Projeto

- **MainActivity.java**: Atividade principal que contém o WebView e carrega a URL do sistema
- **SplashActivity.java**: Atividade de inicialização que exibe a tela de carregamento
- **NoConnectionActivity.java**: Atividade que é exibida quando não há conexão com a internet

## Personalização

O aplicativo foi personalizado com:
- Cores corporativas (#131b2e e #4FC3F7)
- Fonte MuseoModerno para o texto "ema software"
- Ícone personalizado de caixa registradora

## Instalação

Para instalar o aplicativo:
1. Transfira o arquivo APK para o dispositivo Android
2. Abra o arquivo APK no dispositivo
3. Siga as instruções na tela para instalar

## Desenvolvimento

Este aplicativo foi desenvolvido usando:
- Android Studio
- Java para a lógica do aplicativo
- XML para os layouts
- WebView para carregar o conteúdo web

# ReceiptLoop

**ReceiptLoop** é uma aplicação web de fidelização gamificada para pequenos negócios.

A proposta do projeto é transformar cada compra em uma nova oportunidade de relacionamento com o cliente. Após uma venda, o estabelecimento gera um QR Code para a nota digital. O cliente escaneia o código, informa seu WhatsApp e recebe uma peça de um quebra-cabeça de fidelidade. Ao completar todas as peças, ele desbloqueia uma recompensa definida pelo estabelecimento.

## Problema

Pequenos negócios geralmente têm dificuldade em manter clientes recorrentes. Muitos programas de fidelidade ainda dependem de cartões físicos, anotações manuais ou processos pouco atrativos para o cliente.

Esses métodos podem gerar problemas como:

- perda do cartão físico;
- falta de controle sobre visitas e recompensas;
- baixa adesão dos clientes;
- pouca diferenciação na experiência de compra;
- dificuldade para o lojista acompanhar campanhas de fidelidade.

## Solução

O ReceiptLoop propõe uma experiência simples, digital e gamificada.

Em vez de usar um cartão físico, o cliente acumula progresso por meio de uma nota digital com QR Code. Cada compra pode gerar uma nova peça de um quebra-cabeça. Ao completar o conjunto, o cliente recebe uma recompensa.

## Principais funcionalidades

- Cadastro e login de estabelecimento;
- Cadastro de produtos;
- Organização de produtos por categoria;
- Tela de caixa para registrar vendas;
- Geração de QR Code para a nota digital;
- Nota digital acessível pelo cliente;
- Registro do cliente por WhatsApp;
- Sistema de fidelidade com peças colecionáveis;
- Recompensa ao completar o quebra-cabeça;
- Tela de simulação para demonstrar a experiência do cliente.

## Fluxo do sistema

1. O estabelecimento acessa a plataforma.
2. Cadastra seus produtos.
3. Cria uma campanha de fidelidade.
4. Realiza uma venda pela tela de caixa.
5. O sistema gera um QR Code da nota digital.
6. O cliente escaneia o QR Code.
7. O cliente informa o WhatsApp.
8. O sistema registra a visita e libera uma peça.
9. Ao completar todas as peças, o cliente desbloqueia a recompensa.

## Tecnologias utilizadas

- React
- Vite
- React Router
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage
- qrcode.react
- Vercel

## Estrutura principal

```txt
src/
├── pages/
│   ├── Home.jsx
│   ├── Produtos.jsx
│   ├── Caixa.jsx
│   ├── Nota.jsx
│   ├── Simulacao.jsx
│   └── CheckIn.jsx
├── supabase.js
├── App.jsx
└── main.jsx

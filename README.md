# Trefimet

Site institucional estático da **Trefimet** — soluções em metalurgia, trefilação e produtos metálicos.

## Estrutura

```
trefimet/
├── index.html          # Página principal
├── css/style.css       # Estilos
├── js/main.js          # Interatividade (menu, contadores, formulário)
├── server/index.js     # Servidor Node.js (dev + API de contato)
└── package.json
```

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior

## Desenvolvimento local

```bash
npm install   # opcional — sem dependências externas
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O servidor Node.js serve os arquivos estáticos e expõe a rota `POST /api/contato` para o formulário de contato (mensagens salvas em `data/contatos.jsonl`).

## Deploy estático

Para hospedagem puramente estática (GitHub Pages, Netlify, etc.), publique apenas:

- `index.html`
- `css/`
- `js/`

Nesse cenário o formulário exibirá fallback para contato por e-mail (sem backend).

## GitHub Pages

O workflow em `.github/workflows/pages.yml` publica o site automaticamente no push para `main`.

## Licença

Projeto privado — todos os direitos reservados © Trefimet.

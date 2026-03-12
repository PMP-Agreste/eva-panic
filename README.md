# Eva Pânico — PWA Botão de Pânico

PWA instalável para as assistidas da Patrulha Maria da Penha.

---

## Como funciona

1. O gestor gera um **link único** para cada assistida no painel Eva
2. O link é enviado por WhatsApp/SMS para a assistida
3. A assistida **instala o PWA** na tela inicial do celular (1 toque)
4. Em situação de perigo, ela abre o app e toca em **SOCORRO**
5. O app captura GPS e salva o alerta em `alertas_panico` no Firestore
6. O painel do gestor exibe o alerta em tempo real

---

## Estrutura do URL

```
https://seu-dominio.com/?token=TOKEN_ID
```

O `TOKEN_ID` é o ID de um documento na coleção `panic_tokens`.

---

## Configuração

### 1. Firebase — substitua as credenciais em `index.html`

```js
const firebaseConfig = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "SEU_PROJETO.firebaseapp.com",
  projectId:         "SEU_PROJETO",
  ...
};
```

Use as mesmas credenciais do projeto Eva principal.

### 2. Firestore — coleções necessárias

#### `panic_tokens/{tokenId}`
Criado pelo gestor no painel Eva. Estrutura:

```json
{
  "idAssistida":   "ID_DO_DOC_NA_COLECAO_assistidas",
  "guarnicaoTel":  "81999990000",
  "guarnicaoNome": "PMP Alfa",
  "ativo":         true,
  "criadoEm":      "Timestamp"
}
```

#### `alertas_panico/{alertaId}`
Criado automaticamente pelo PWA ao apertar o botão:

```json
{
  "idAssistida":    "...",
  "nomeAssistida":  "...",
  "guarnicao":      "PMP Alfa",
  "guarnicaoTel":   "81999990000",
  "token":          "...",
  "latitude":       -9.665,
  "longitude":      -35.735,
  "precisaoMetros": 15,
  "timestamp":      "ServerTimestamp",
  "status":         "pendente",
  "origem":         "pwa"
}
```

### 3. Regras do Firestore

Aplique as regras do arquivo `firestore.rules` no console do Firebase.

> ⚠️ **Segurança**: A leitura de `assistidas` está aberta para o PWA funcionar sem login.
> Para maior segurança, use uma **Cloud Function** como intermediária.

### 4. Deploy

O PWA pode ser hospedado no **Netlify** (junto com o projeto Eva) ou em qualquer hosting estático.

```
netlify deploy --prod --dir=eva-panic
```

Ou crie um site separado no Netlify apontando para esta pasta.

---

## Como gerar um link para a assistida (painel Eva)

No painel Eva, você precisará adicionar um botão que:

1. Cria um documento em `panic_tokens` com os dados da assistida
2. Gera o link: `https://eva-panico.netlify.app/?token={docId}`
3. Exibe o link com botão "Copiar" e "Enviar por WhatsApp"

**Envio por WhatsApp:**
```
https://wa.me/55{telefone}?text=Olá%20{nome}!%20Seu%20botão%20de%20pânico%20está%20pronto.%20Acesse%20e%20instale%20no%20seu%20celular:%20https://eva-panico.netlify.app/?token={tokenId}
```

---

## Próximos passos sugeridos

- [ ] Adicionar aba "Alertas" no painel Eva para ver alertas em tempo real
- [ ] Notificações push via Firebase Cloud Messaging (FCM)
- [ ] Gerar ícones reais (192x192 e 512x512) para o manifest
- [ ] Cloud Function para maior segurança na leitura das assistidas
- [ ] Botão "Gerar link de pânico" na página de cada assistida no painel Eva

# Como publicar a Floreer — passo a passo

Siga essa ordem. Cada passo tem link direto.

---

## PASSO 1 — Instalar o Node.js no seu computador

1. Acesse: https://nodejs.org
2. Clique em **"LTS"** (botão verde à esquerda)
3. Instale normalmente
4. Reinicie o computador se pedido

---

## PASSO 2 — Rodar o site localmente

1. Abra a pasta `floreer-site` no computador
2. Clique com o botão direito dentro da pasta → **"Abrir no Terminal"**
3. Digite e aperte Enter:
   ```
   npm install
   ```
4. Depois:
   ```
   cp .env.local.example .env.local
   npm run dev
   ```
5. Abra no navegador: http://localhost:3000
   → O site aparece! (ainda sem login/pagamento funcionando — isso é normal agora)

---

## PASSO 3 — Criar conta no Supabase (banco de dados + login)

1. Acesse: https://supabase.com
2. Clique em **"Start your project"** → crie conta com Google
3. Crie um novo projeto:
   - Nome: `floreer`
   - Senha: anote bem
   - Região: **South America (São Paulo)**
4. Quando o projeto carregar, vá em **Settings → API**
5. Copie:
   - `Project URL` → cole em `.env.local` na linha `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Criar as tabelas do banco:

No Supabase, vá em **SQL Editor** e cole isso:

```sql
-- Tabela de compras
create table compras (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users(id),
  curso_slug text not null,
  status text default 'pendente',
  pagamento_id text,
  criado_em timestamp default now()
);

-- Tabela de progresso
create table progresso (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users(id),
  curso_slug text not null,
  modulo_num text not null,
  aula_num int not null,
  concluida boolean default false,
  atualizado_em timestamp default now(),
  unique(usuario_id, curso_slug, modulo_num, aula_num)
);

-- Segurança: cada aluna só vê seus dados
alter table compras enable row level security;
alter table progresso enable row level security;

create policy "Aluna vê suas compras" on compras
  for select using (auth.uid() = usuario_id);

create policy "Aluna vê seu progresso" on progresso
  for all using (auth.uid() = usuario_id);
```

Clique em **Run**.

---

## PASSO 4 — Criar conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie conta (ou entre se já tiver)
3. Crie um novo **aplicativo**
4. Vá em **Credenciais de produção**
5. Copie o **Access Token** → cole em `.env.local` na linha `MERCADOPAGO_ACCESS_TOKEN`

---

## PASSO 5 — Criar conta no Resend (e-mails automáticos)

1. Acesse: https://resend.com
2. Crie conta gratuita
3. Vá em **API Keys → Create API Key**
4. Copie → cole em `.env.local` na linha `RESEND_API_KEY`
5. Em **Domains**, adicione seu domínio quando tiver (ex: floreer.com.br)

---

## PASSO 6 — Publicar no GitHub

1. Acesse: https://github.com e crie uma conta
2. Clique em **"New repository"**
   - Nome: `floreer-site`
   - Private (privado)
   - Clique em **Create repository**
3. Siga as instruções que aparecem na tela para fazer o upload da pasta

---

## PASSO 7 — Publicar no Vercel (site no ar!)

1. Acesse: https://vercel.com
2. **"Sign up"** → entrar com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `floreer-site`
5. Em **"Environment Variables"**, adicione todas as variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` = https://floreer.com.br (ou o link do Vercel por enquanto)
6. Clique em **Deploy**

O Vercel vai gerar um link tipo `floreer-site.vercel.app` — o site já está no ar!

---

## PASSO 8 — Conectar o domínio floreer.com.br

1. Registre o domínio em: https://registro.br (~R$40/ano)
2. No Vercel → seu projeto → **Settings → Domains**
3. Adicione `floreer.com.br`
4. O Vercel mostra os DNS que você precisa configurar no registro.br
5. Em 24h o site fica em floreer.com.br

---

## Custo total

| Item | Custo |
|------|-------|
| Node.js | Grátis |
| Supabase | Grátis (até 50.000 usuários) |
| Vercel | Grátis |
| Resend | Grátis (3.000 e-mails/mês) |
| Mercado Pago | Grátis (cobra ~5% por venda) |
| floreer.com.br | ~R$ 40/ano |
| **Total** | **~R$ 40/ano** |

---

Qualquer dúvida em qualquer passo, é só perguntar!

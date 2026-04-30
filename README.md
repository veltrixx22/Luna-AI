# Luna AI 🌙

Luna AI é um aplicativo web completo e premium para acompanhamento do ciclo menstrual, combinando um design mobile-first elegante com uma assistente de inteligência artificial.

## 🚀 Tecnologias
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js (Express)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Auth**: JWT com cookies httpOnly + bcrypt
- **IA**: OpenAI API (GPT-3.5) / Google Gemini fallback
- **PWA**: Instalável em Android e iOS

## 🛠️ Configuração Local

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` baseado no `.env.example`:
   ```env
   DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/DATABASE?schema=public"
   JWT_SECRET="uma-chave-segura"
   GEMINI_API_KEY="sua-chave-gemini"
   ```
   **Importante:** Não utilize `localhost` como host da `DATABASE_URL` no Vercel ou na prévia do AI Studio, pois o banco deve estar acessível externamente.

3. **Prisma e Banco de Dados**:
   Certifique-se de configurar a `DATABASE_URL` corretamente.
   
   **Gerar Cliente Prisma**:
   ```bash
   npx prisma generate
   ```

   **Migrações em Desenvolvimento**:
   ```bash
   npx prisma migrate dev --name init
   ```

   **Migrações em Produção**:
   Se você estiver fazendo o deploy do app (ex: Vercel, Railway, etc), execute:
   ```bash
   npx prisma migrate deploy
   ```

   **Nota:** Sempre certifique-se de que o diretório `prisma/migrations` está no seu repositório.

4. **Iniciar em Desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📱 Funcionalidades
- **Landing Page**: Apresentação profissional e segura.
- **Autenticação**: Registro e login seguros com validação.
- **Onboarding**: Configuração personalizada do ciclo inicial.
- **Dashboard**: Visão clara do dia do ciclo, próxima menstruação e janela fértil.
- **Ciclo**: Histórico completo e registro de datas.
- **Sintomas**: Log diário de humor, fluxo, cólicas e notas.
- **Luna AI**: Chatbot educacional sobre saúde íntima.
- **PWA**: Adicione à tela inicial para uma experiência de aplicativo nativo.

## ⚠️ Aviso Médico
A Luna AI oferece informações educativas e estimativas. Ela não substitui médicos ou diagnósticos profissionais. Recomendamos sempre buscar ajuda médica para preocupações graves ou urgências.

## 📄 Licença
Distribuído sob a licença Apache-2.0.

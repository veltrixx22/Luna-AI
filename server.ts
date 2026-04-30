import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const IS_PROD = process.env.NODE_ENV === "production";

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não autorizado" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Sessão expirada" });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Health Check: DB
  app.get("/api/health/db", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ ok: false, message: "DATABASE_URL não configurada" });
      }
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true, message: "Banco conectado com sucesso" });
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ ok: false, message: "Erro ao conectar no banco" });
    }
  });

  // Auth: Register
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Banco de dados não configurado (.env ausente ou inválido)" });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "O nome é obrigatório" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail inválido" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "A senha precisa ter no mínimo 8 caracteres." });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user and default profile in a transaction
      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: { 
            name, 
            email, 
            passwordHash,
          },
        });

        await tx.profile.create({
          data: {
            userId: newUser.id,
            averageCycleLength: 28,
            averagePeriodDuration: 5,
            cycleRegularity: "regular",
          }
        });

        return newUser;
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Conta criada com sucesso", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      console.error("Registration error detail:", error);
      
      if (error?.code === 'P2021' || error?.message?.includes('table') || error?.message?.includes('relation')) {
        return res.status(500).json({ error: "As tabelas do banco ainda não foram criadas. Execute a migration." });
      }
      
      if (error?.message?.includes('Can\'t reach database')) {
        return res.status(500).json({ error: "Não foi possível conectar ao banco de dados." });
      }

      res.status(500).json({ error: "Erro interno no servidor ao criar conta." });
    }
  });

  // Auth: Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(400).json({ error: "E-mail ou senha incorretos" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login realizado", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Erro no servidor" });
    }
  });

  // Auth: Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout realizado" });
  });

  // Auth: Me
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { profile: true },
      });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json({ id: user.id, name: user.name, email: user.email, profile: user.profile });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });

  // Onboarding
  app.post("/api/profile/onboarding", authenticateToken, async (req: any, res) => {
    const { averageCycleLength, averagePeriodDuration, cycleRegularity, usageGoal } = req.body;
    try {
      const profile = await prisma.profile.upsert({
        where: { userId: req.user.userId },
        update: { averageCycleLength, averagePeriodDuration, cycleRegularity, usageGoal },
        create: { userId: req.user.userId, averageCycleLength, averagePeriodDuration, cycleRegularity, usageGoal },
      });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar preferências" });
    }
  });

  // Cycles
  app.get("/api/cycles", authenticateToken, async (req: any, res) => {
    const cycles = await prisma.cycle.findMany({
      where: { userId: req.user.userId },
      orderBy: { periodStartDate: "desc" },
    });
    res.json(cycles);
  });

  app.post("/api/cycles", authenticateToken, async (req: any, res) => {
    const { periodStartDate, periodEndDate, notes } = req.body;
    try {
      const cycle = await prisma.cycle.create({
        data: {
          userId: req.user.userId,
          periodStartDate: new Date(periodStartDate),
          periodEndDate: periodEndDate ? new Date(periodEndDate) : null,
          notes,
        },
      });
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar ciclo" });
    }
  });

  // Symptoms
  app.get("/api/symptoms", authenticateToken, async (req: any, res) => {
    const logs = await prisma.symptomLog.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: "desc" },
    });
    res.json(logs);
  });

  app.post("/api/symptoms", authenticateToken, async (req: any, res) => {
    const { date, flowIntensity, crampsLevel, mood, symptoms, notes } = req.body;
    try {
      const log = await prisma.symptomLog.create({
        data: {
          userId: req.user.userId,
          date: new Date(date),
          flowIntensity,
          crampsLevel,
          mood,
          symptoms,
          notes,
        },
      });
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar sintomas" });
    }
  });

  // AI Chat
  app.post("/api/chat", authenticateToken, async (req: any, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Mensagem vazia" });

    const systemPrompt = `Você é a Luna AI, uma assistente educacional gentil para acompanhamento do ciclo menstrual. Responda em Português Brasileiro. Ajude a entender padrões do ciclo, sintomas e fornecer educação geral sobre saúde íntima. Você não é médica e não deve diagnosticar, prescrever medicamentos ou substituir conselhos profissionais. Para sintomas graves, preocupações com gravidez, sangramento anormal, dor intensa ou urgências, recomende sempre a consulta com um profissional de saúde.`;

    try {
      let aiResponse = "";

      if (openai) {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        });
        aiResponse = response.choices[0].message.content || "Desculpe, tive um problema ao processar sua resposta.";
      } else if (genAI) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`${systemPrompt}\n\nUsuário: ${message}`);
        const response = await result.response;
        aiResponse = response.text();
      } else {
        return res.status(503).json({ error: "Assistente de IA não configurado." });
      }

      // Store in DB
      await prisma.aIMessage.createMany({
        data: [
          { userId: req.user.userId, role: "user", content: message },
          { userId: req.user.userId, role: "assistant", content: aiResponse },
        ],
      });

      res.json({ response: aiResponse });
    } catch (error) {
      res.status(500).json({ error: "Erro na comunicação com a IA" });
    }
  });

  // --- Vite & Client ---
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luna AI running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server error:", err);
});

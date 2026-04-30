import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getUserId() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.aIMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await request.json();
  if (!message) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, cycles: { take: 1, orderBy: { periodStartDate: "desc" } } }
    });

    const context = `Você é a Luna AI, uma assistente virtual gentil, empática e informativa focada em saúde feminina.
    Usuária: ${user?.name}
    Objetivo: ${user?.profile?.usageGoal || "Não definido"}
    Média de ciclo: ${user?.profile?.averageCycleLength} dias.
    Duração média: ${user?.profile?.averagePeriodDuration} dias.
    Última menstruação física registrada: ${user?.cycles[0]?.periodStartDate ? user.cycles[0].periodStartDate.toISOString() : "Sem registro"}.
    
    Responda em Português-BR. Seja amigável e use um tom de acolhimento. 
    AVISO: Sempre reforce que você não substitui um médico e em caso de dor ou urgência, ela deve procurar um profissional.`;

    const chatInstance = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const prompt = `${context}\n\nPergunta da usuária: ${message}`;
    const result = await chatInstance.sendMessage(prompt);
    const aiResponse = result.response.text();

    // Store messages
    await prisma.aIMessage.createMany({
      data: [
        { userId, role: "user", content: message },
        { userId, role: "assistant", content: aiResponse },
      ]
    });

    return NextResponse.json({ content: aiResponse });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Erro ao processar mensagem com a IA" }, { status: 500 });
  }
}

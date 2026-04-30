import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: false, message: "DATABASE_URL não configurada" }, { status: 500 });
    }
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, message: "Banco conectado com sucesso" });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({ ok: false, message: "Erro ao conectar no banco" }, { status: 500 });
  }
}

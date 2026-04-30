import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json({ error: "Dados inválidos ou senha muito curta (mín. 8 caracteres)" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, passwordHash },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          averageCycleLength: 28,
          averagePeriodDuration: 5,
        }
      });

      return newUser;
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ message: "Conta criada com sucesso", user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao criar conta." }, { status: 500 });
  }
}

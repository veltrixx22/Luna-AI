import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

async function getUserId() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.symptomLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  
  const log = await prisma.symptomLog.create({
    data: {
      userId,
      date: new Date(body.date),
      flowIntensity: body.flowIntensity,
      crampsLevel: body.crampsLevel,
      mood: body.mood,
      symptoms: body.symptoms,
      notes: body.notes,
    }
  });
  
  return NextResponse.json(log);
}

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

  const cycles = await prisma.cycle.findMany({
    where: { userId },
    orderBy: { periodStartDate: "desc" },
  });
  return NextResponse.json(cycles);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { periodStartDate, periodEndDate, notes } = await request.json();
  
  const cycle = await prisma.cycle.create({
    data: {
      userId,
      periodStartDate: new Date(periodStartDate),
      periodEndDate: periodEndDate ? new Date(periodEndDate) : null,
      notes,
    }
  });
  
  return NextResponse.json(cycle);
}

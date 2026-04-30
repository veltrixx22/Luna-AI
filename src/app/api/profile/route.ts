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

export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  
  const profile = await prisma.profile.update({
    where: { userId },
    data: {
      averageCycleLength: body.averageCycleLength,
      averagePeriodDuration: body.averagePeriodDuration,
      cycleRegularity: body.cycleRegularity,
      usageGoal: body.usageGoal,
    }
  });
  
  return NextResponse.json(profile);
}

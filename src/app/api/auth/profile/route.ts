import { db } from "@/lib/db";
import {
  userProfiles,
  contractorProfiles,
  clientProfiles,
} from "@/lib/db/schema/platform";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, userType, userId } = body;

    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !userType || !userId) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validar que userType sea válido
    if (!["contractor", "client"].includes(userType)) {
      return NextResponse.json(
        { error: "Tipo de usuario inválido" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya tiene un perfil
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json(
        { error: "El usuario ya tiene un perfil" },
        { status: 409 }
      );
    }

    // Crear el perfil de usuario
    const [newUserProfile] = await db
      .insert(userProfiles)
      .values({
        userId,
        firstName,
        lastName,
        userType: userType as "contractor" | "client",
        phone: null,
        country: null,
        preferredCurrency: "USD",
        active: true,
      })
      .returning();

    // Crear el perfil específico según el tipo de usuario
    if (userType === "contractor") {
      await db.insert(contractorProfiles).values({
        userProfileId: newUserProfile.id,
        username: null,
        specialties: [],
        experienceYears: null,
        hourlyRate: null,
        portfolioUrl: null,
        bio: null,
        skills: [],
        availability: "unavailable",
        timezone: null,
        profileComplete: false,
        averageRating: "0",
        totalProjectsCompleted: 0,
      });
    } else {
      await db.insert(clientProfiles).values({
        userProfileId: newUserProfile.id,
        company: null,
        industry: null,
        website: null,
        companyDescription: null,
        size: null,
        verificationStatus: "pending",
        totalContractsCreated: 0,
        averageRating: "0",
      });
    }

    return NextResponse.json(
      {
        message: "Perfil creado exitosamente",
        profile: newUserProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

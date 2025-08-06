import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import {
  getUserProfileByAuthId,
  createCompleteProfile,
  updateCompleteProfile,
} from "@/lib/db/queries/platform";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userProfile = await getUserProfileByAuthId(session.user.id);

    if (!userProfile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Get user auth data including wallet address
    const authUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        walletAddress: true,
        email: true,
      },
    });

    return NextResponse.json({
      ...userProfile,
      authUser,
      walletAddress: authUser?.walletAddress, // Include for easier access
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      userType,
      firstName,
      lastName,
      phone,
      country,
      preferredCurrency,
      contractorData,
      clientData,
    } = body;

    // Validate that the userId matches the session user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if profile already exists
    const existingProfile = await getUserProfileByAuthId(session.user.id);
    if (existingProfile) {
      return NextResponse.json(
        { error: "El perfil ya existe" },
        { status: 400 }
      );
    }

    // Prepare profile data
    const profileData: any = {
      userProfile: {
        userId: session.user.id,
        firstName,
        lastName,
        phone,
        country,
        userType,
        preferredCurrency: preferredCurrency || "USD",
      },
    };

    // Add specific profile data based on user type
    if (userType === "contractor" && contractorData) {
      profileData.contractorProfile = {
        username: contractorData.username,
        specialties: contractorData.specialties,
        experienceYears: contractorData.experienceYears,
        hourlyRate: contractorData.hourlyRate
          ? String(contractorData.hourlyRate)
          : null,
        portfolioUrl: contractorData.portfolioUrl,
        bio: contractorData.bio,
        skills: contractorData.skills,
        availability: contractorData.availability || "unavailable",
        timezone: contractorData.timezone,
      };
    } else if (userType === "client" && clientData) {
      profileData.clientProfile = {
        company: clientData.company,
        industry: clientData.industry,
        website: clientData.website,
        companyDescription: clientData.companyDescription,
        size: clientData.size,
      };
    }

    // Create the complete profile
    const result = await createCompleteProfile(profileData);

    return NextResponse.json(
      {
        message: "Perfil creado exitosamente",
        profile: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      userType,
      firstName,
      lastName,
      phone,
      country,
      preferredCurrency,
      contractorData,
      clientData,
    } = body;

    // Validate that the userId matches the session user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if profile exists
    const existingProfile = await getUserProfileByAuthId(session.user.id);
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Prepare profile update data
    const profileData: any = {
      userProfile: {
        firstName,
        lastName,
        phone,
        country,
        preferredCurrency: preferredCurrency || "USD",
      },
    };

    // Add specific profile data based on user type
    if (userType === "contractor" && contractorData) {
      profileData.contractorProfile = {
        username: contractorData.username,
        specialties: contractorData.specialties,
        experienceYears: contractorData.experienceYears,
        hourlyRate: contractorData.hourlyRate
          ? String(contractorData.hourlyRate)
          : null,
        portfolioUrl: contractorData.portfolioUrl,
        bio: contractorData.bio,
        skills: contractorData.skills,
        availability: contractorData.availability || "unavailable",
        timezone: contractorData.timezone,
      };
    } else if (userType === "client" && clientData) {
      profileData.clientProfile = {
        company: clientData.company,
        industry: clientData.industry,
        website: clientData.website,
        companyDescription: clientData.companyDescription,
        size: clientData.size,
      };
    }

    // Update the complete profile
    const result = await updateCompleteProfile(session.user.id, profileData);

    return NextResponse.json(
      {
        message: "Perfil actualizado exitosamente",
        profile: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

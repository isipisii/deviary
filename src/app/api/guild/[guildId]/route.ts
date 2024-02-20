import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { utapi } from "@/utils/uploadthingapi";
import { guildSchema } from "@/lib/validators/guild.validator";

type TParams = {
  params: {
    guildId: string;
  };
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
  const formData = await req.formData();
  const session = await getServerSideSession();
  const guildId = params.guildId;

  const imageFile = formData.get("imageFile");
  const guildName = formData.get("guildName");
  const guildDescription = formData.get("guildDescription");
  const isPrivate = formData.get("isPrivate") === "true" ? true : false;

  let uploadedImage: any;

  const parsedGuildData = guildSchema.safeParse({
    name: guildName,
    description: guildDescription,
  });

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 },
      );
    }

    if (!parsedGuildData.success) {
      return NextResponse.json(
        {
          errors: parsedGuildData.error.flatten().fieldErrors,
          message: "Error in guild data.",
        },
        { status: 400 },
      );
    }

    const guild = await db.guild.findUnique({
      where: {
        id: guildId,
      },
    });

    if (!guild) {
      return NextResponse.json(
        {
          success: false,
          message: "Guild not found",
        },
        { status: 404 },
      );
    }

    if (imageFile) {
      const { data } = await utapi.uploadFiles(imageFile);

      if (data) {
        uploadedImage = {
          key: data.key,
          url: data.url,
        };
      }
    }

    const updatedGuild = await db.guild.update({
      data: {
        name: parsedGuildData.data.name,
        description: parsedGuildData.data.description,
        ...(imageFile &&
          uploadedImage && {
            image: {
              imageKey: uploadedImage.key as string,
              imageUrl: uploadedImage.url as string,
            },
          }),
        isPrivate,
      },
      where: {
        id: guildId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        guild: updatedGuild,
        message: "Guild updated",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest, { params }: TParams) => {
  const guildId = params.guildId;
  const session = await getServerSideSession();

  const selectedUserFields = {
    id: true,
    name: true,
    email: true,
    image: true,
    bio: true
  };

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 },
      );
    }

    const guildMembersCount = await db.guildMember.count({
      where: {
        guildId
      }
    })

    const isUserAGuildMember = await db.guildMember.count({
      where: {
        guildId,
        userId: session.user.id
      }
    }) > 0

    const hasAnExistingJoinRequest = await db.joinRequest.count({
      where: {
        guildId,
        senderId: session.user.id
      }
    }) > 0

    const guild = await db.guild.findUnique({
      where: {
        id: guildId,
      },
      include: {
        creator: {
          select: {
            ...selectedUserFields
          },
        },
        members: {
          take: 5,
          include: {
            user: {
              select: {
                ...selectedUserFields
              }
            }
          }
        },
      },
    });

    if (!guild) {
      return NextResponse.json(
        {
          success: false,
          message: "Guild not found",
        },
        { status: 404 },
      );
    }
  
    const guildWithAdditionalFields = {
      ...guild,
      isBelong: isUserAGuildMember,
      membersCount: guildMembersCount,
      hasAnExistingJoinRequest
    } 

    return NextResponse.json(
      {
        guild: guildWithAdditionalFields,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {

    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const guildId = params.guildId;

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 },
      );
    }

    const guild = await db.guild.findUnique({
      where: {
        id: guildId,
      },
    });

    if (!guild) {
      return NextResponse.json(
        {
          success: false,
          message: "Guild not found",
        },
        { status: 404 },
      );
    }

    if (session.user.id !== guild.creatorId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot delete this guild",
        },
        { status: 403 },
      );
    }

    await db.guild.delete({
      where: {
        id: guildId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Guild deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { utapi } from "@/utils/uploadthingapi";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const userId = params.userId;

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        social: {
          select: {
            facebook: true,
            github: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    const { password, guildFilter, feedFilter, ...restUserFiels } = user;
    return NextResponse.json(
      {
        user: restUserFiels,
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const session = await getServerSideSession();
  const userId = params.userId;
  const body = await req.formData();

  const name = body.get("name");
  const username = body.get("username");
  const bio = body.get("bio");
  const profileImage = body.get("profileImage");
  const backgroundImage = body.get("backgroundImage");
  const githubProfileLink = body.get("githubLink");
  const facebookProfileLink = body.get("facebookLink");

  let uploadedProfileImage;
  let uploadedBackgroundImage = {
    imageUrl: "",
    imageKey: "",
  };

  try {
    if (!session)
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated, please log in first",
        },
        { status: 401 },
      );

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    const existingUsername = await db.user.findFirst({
      where: {
        username: username as string,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          message: "This username is already existing",
          success: false,
        },
        {
          status: 400,
        },
      );
    }

    if (profileImage) {
      const response = await utapi.uploadFiles(profileImage);
      uploadedProfileImage = response.data?.url as string;
    }

    if (backgroundImage) {
      const response = await utapi.uploadFiles(backgroundImage);
      uploadedBackgroundImage.imageUrl = response.data?.url as string;
      uploadedBackgroundImage.imageKey = response.data?.key as string;
    }

    await db.social.upsert({
      where: {
        userId,
      },
      update: {
        github: githubProfileLink as string,
        facebook: facebookProfileLink as string,
      },
      create: {
        github: githubProfileLink as string,
        facebook: facebookProfileLink as string,
        userId,
      },
    });

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name as string,
        bio: bio as string,
        username: username as string,
        ...(uploadedProfileImage && {
          image: uploadedProfileImage,
        }),
        ...(uploadedBackgroundImage && {
          backgroundImage: {
            imageKey: uploadedBackgroundImage.imageKey,
            imageUrl: uploadedBackgroundImage.imageUrl,
          },
        }),
      },
      include: {
        social: {
          select: {
            facebook: true,
            github: true,
          },
        },
      },
    });

    const { password, guildFilter, feedFilter, ...restUserFiels } = updatedUser;
    return NextResponse.json(
      {
        updatedUser: restUserFiels,
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
};

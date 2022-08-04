import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/prisma/client';
import { Prisma, Role } from '@prisma/client';
import type { SafeUserUpdate } from '@/prisma/types';
import { UserDisplayInfo } from '@/store/usersReducer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { user },
    method,
  } = req;

  const session = await getSession({ req });
  if (!session) res.status(401).end('Not Authenticated');
  const { address: walletAddress } = session!;

  switch (method) {
    case 'POST':
      await createUser(String(walletAddress), res);
      return;
    case 'PATCH':
      await updateUser(user, String(walletAddress), res);
      return;
    case 'GET':
      const { action } = req.query;
      if (action == 'GetAllUsersAndEarnedPoints') {
        await getAllUsersAndEarnedPoints(res);
      } else if (action == 'PromoteToArtist') {
        await promoteToArtist(String(req.query.address), res);
      } else if (action == 'GetFollowing') {
        await getFollowing(String(walletAddress), res);
      } else if (action == 'Follow') {
        await follow(String(walletAddress), String(req.query.address), res);
      } else if (action == 'Unfollow') {
        await unfollow(String(walletAddress), String(req.query.address), res);
      } else if (req.query.wallet) {
        await getUserDisplayInfo(String(req.query.wallet), res);
      } else {
        await getUser(String(walletAddress), res);
      }
      res.end();
      return;
    default:
      res.status(501).end();
  }
};

async function getUser(walletAddress: string, res: NextApiResponse) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });
    if (!existingUser) {
      await createUser(walletAddress, res);
      return;
    }
    res.status(200).send(existingUser);
  } catch (e) {
    res.status(500).end;
  }
}

async function getUserDisplayInfo(walletAddress: string, res: NextApiResponse) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });
    if (user) {
      res.json(<UserDisplayInfo>{
        username: user.username,
        profilePicture: user.profilePicture,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end;
  }
}

async function getAllUsersAndEarnedPoints(res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      include: { EarnedPoints: true },
    });
    const json = JSON.stringify(users, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    res.status(200).end(json);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

async function createUser(walletAddress: string, res: NextApiResponse) {
  try {
    const newUser = await prisma.user.create({
      data: {
        walletAddress,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

async function updateUser(user: SafeUserUpdate, walletAddress: string, res: NextApiResponse) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        walletAddress,
      },
      data: user,
    });
    res.status(200).json(updatedUser);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      res.status(200).json({ error: 'Unique constraint violation' });
    } else {
      res.status(200).json({ error: e });
    }
  }
}

async function promoteToArtist(walletAddress: string, res: NextApiResponse) {
  console.log(`promoteToArtist(${walletAddress})`);
  try {
    const updatedUser = await prisma.user.update({
      where: {
        walletAddress,
      },
      data: {
        role: Role.ARTIST,
      },
    });
    res.status(200).json({ success: !!updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

async function getFollowing(walletAddress: string, res: NextApiResponse) {
  try {
    const following: string[] = [];
    const result = await prisma.follow.findMany({
      where: { walletAddress },
      select: { followedAddress: true }
    });
    result.forEach(row => following.push(row.followedAddress));
    console.log(`getFollowing(${walletAddress}) :: ${result.length}`);
    res.status(200).json(following);
  } catch (e) {
    console.log(e);
    res.status(500).end;
  }
}

async function follow(walletAddress: string, followedAddress: string, res: NextApiResponse) {
  console.log(`follow(${walletAddress}, ${followedAddress})`);
  try {
    const user = await prisma.follow.create({
      data: { walletAddress, followedAddress }
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end;
  }
}

async function unfollow(walletAddress: string, followedAddress: string, res: NextApiResponse) {
  console.log(`unfollow(${walletAddress}, ${followedAddress})`);
  try {
    const user = await prisma.follow.delete({
      where: { walletAddress_followedAddress: { walletAddress, followedAddress } },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end;
  }
}
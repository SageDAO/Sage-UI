import {
  basePathCreators,
  basePathDrops,
  basePathAuctions,
  basePathLotteries,
  basePathHome,
  basePathSubmissions,
  basePathProfile,
} from '@/constants/paths';
import { useRouter } from 'next/router';
import { User, Drop } from '@prisma/client';

export default function useSageRoutes() {
  const router = useRouter();

  async function pushToCreators(username?: User['username']) {
    if (username) {
      await router.push(basePathCreators + '/' + username);
    } else {
      await router.push(basePathCreators);
    }
  }

  async function pushToDrops(dropId?: Drop['id']) {
    if (dropId) {
      await router.push(basePathDrops + '/' + dropId);
    } else {
      await router.push(basePathDrops);
    }
  }

  async function pushToHome() {
    await router.push(basePathHome);
  }

  async function pushToSubmissions() {
    await router.push(basePathSubmissions);
  }

  async function pushToProfile() {
    await router.push(basePathProfile);
  }

  const { pathname } = router;

  const isProfilePage: boolean = pathname.includes(basePathProfile);
  const isSingleDropsPage: boolean = pathname.includes(basePathDrops + '/');

  return {
    pushToCreators,
    pushToDrops,
    pushToHome,
    pushToSubmissions,
    pushToProfile,
    isProfilePage,
    isSingleDropsPage,
  };
}

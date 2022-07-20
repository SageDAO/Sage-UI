import { useGetUserQuery } from '@/store/usersReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { useSession } from 'next-auth/react';
import { useEnsName } from 'wagmi';

export default function UserHandle() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: userData } = useGetUserQuery();
  const { data: ensData } = useEnsName({ address: sessionData?.address as string });

  /*
	component should never show if user is not securely authenticated;
	*/
  if (sessionStatus !== 'authenticated') return null;

  /*
	priority order:
	1) ENS, if available (in accent colors)
	2) username, if available (in standard colors)
	3) shortened address i.e. 0X...02DF (in standard colors)
	4) 'error' string; 
	*/
  const userHandle =
    ensData ?? userData?.username ?? shortenAddress(sessionData?.address as string) ?? 'error';

  return (
    <span data-is-ens={!!ensData} className='user-handle'>
      {userHandle}
    </span>
  );
}

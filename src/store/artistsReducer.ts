import { baseApi } from './baseReducer';
import { BigNumber, ethers, Signer } from 'ethers';
import { getERC20Contract, getNFTContract } from '@/utilities/contracts';
import { parameters } from '@/constants/config';
import { toast } from 'react-toastify';
import { playTxSuccessSound } from '@/utilities/sounds';

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtistBalance: builder.query<string, string>({
      queryFn: async (artistContractAddress) => {
        const erc20Contract = await getERC20Contract();
        const fullBalance = await erc20Contract.balanceOf(artistContractAddress);
        const artistBalance = fullBalance.mul(BigNumber.from(80)).div(BigNumber.from(100));
        const artistBalanceStr = ethers.utils.formatUnits(artistBalance);
        console.log(`getArtistBalance() :: ${fullBalance}`);
        console.log(`getArtistBalance() :: ${artistBalanceStr}`);
        return { data: artistBalanceStr };
      },
      providesTags: ['ArtistBalance'],
    }),
    withdrawArtistBalance: builder.mutation<
      null,
      { artistContractAddress: string; signer: Signer }
    >({
      queryFn: async ({ artistContractAddress, signer }) => {
        const { ASHTOKEN_ADDRESS } = parameters;
        const contract = await getNFTContract(artistContractAddress, signer as Signer);
        var tx = await contract.withdrawERC20(ASHTOKEN_ADDRESS);
        toast.promise(tx.wait(), {
          pending: 'Withdrawal submitted to the blockchain, awaiting confirmation...',
          success: `Success! Your balance has been withdrawed!`,
          error: 'Failure! Unable to complete request.',
        });
        await tx.wait();
        playTxSuccessSound();
        return { data: null };
      },
      invalidatesTags: ['ArtistBalance'],
    }),
  }),
});

export const { useGetArtistBalanceQuery, useWithdrawArtistBalanceMutation } = artistsApi;

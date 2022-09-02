import { baseApi } from './baseReducer';
import { BigNumber, ethers, Signer } from 'ethers';
import { getERC20Contract, getNFTContract } from '@/utilities/contracts';
import { parameters } from '@/constants/config';
import { playTxSuccessSound } from '@/utilities/sounds';
import { promiseToast } from '@/utilities/toast';

export interface NftContractBalance {
  balance: string;
  artistSplit: string;
  sageSplit: string;
}

const artistsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getArtistBalance: builder.query<NftContractBalance, string>({
      queryFn: async (artistContractAddress) => {
        const erc20Contract = await getERC20Contract();
        const fullBalance = await erc20Contract.balanceOf(artistContractAddress);
        const artistSplit = fullBalance.mul(BigNumber.from(80)).div(BigNumber.from(100));
        const sageSplit = fullBalance.sub(artistSplit);
        const data = {
          balance: ethers.utils.formatUnits(fullBalance),
          artistSplit: ethers.utils.formatUnits(artistSplit),
          sageSplit: ethers.utils.formatUnits(sageSplit),
        } as NftContractBalance;
        console.log(`getArtistBalance() :: ${data}`);
        return { data };
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
        promiseToast(tx, 'Balance has been withdrawed!');
        await tx.wait();
        playTxSuccessSound();
        return { data: null };
      },
      invalidatesTags: ['ArtistBalance'],
    }),
  }),
});

export const { useGetArtistBalanceQuery, useWithdrawArtistBalanceMutation } = artistsApi;

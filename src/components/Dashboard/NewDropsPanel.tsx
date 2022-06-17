import { useGetDropsPendingApprovalQuery } from '@/store/services/dropsReducer';
import Loader from 'react-loader-spinner';
import NewDropCard from './NewDropCard';

export function NewDropsPanel() {
  const { data: drops, isFetching } = useGetDropsPendingApprovalQuery();
  if (isFetching) {
    return (
      <div style={{ margin: '25px' }}>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }
  if (drops?.length == 0) {
    return (
      <div style={{ marginTop: '50px', marginLeft: '50px', color: '#6f676e' }}>
        No pending approvals.
      </div>
    );
  }
  return (
    <div className='collection'>
      <div className='collection__grid'>
        {drops?.map((drop) => (
          <NewDropCard key={drop.id} drop={drop} />
        ))}
      </div>
    </div>
  );
}

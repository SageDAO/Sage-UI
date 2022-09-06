import { useGetConfigQuery, useUpdateConfigMutation } from '@/store/dashboardReducer';
import { useGetApprovedDropsQuery } from '@/store/dropsReducer';
import LoaderDots from '../LoaderDots';
import LoaderSpinner from '../LoaderSpinner';

export function ConfigPanel() {
  const { data: drops, isFetching: isFetchingDrops } = useGetApprovedDropsQuery();
  const { data: config, isFetching: isFetchingConfig } = useGetConfigQuery();
  const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateConfigMutation();

  const handleSaveButtonClick = () => {};
  const handleWelcomeMessageChange = () => {};
  const handleFeaturedDropChange = () => {};

  if (isFetchingConfig || isFetchingDrops) {
    return <LoaderDots />;
  }
  return (
    <div style={{ width: '50%' }}>
      <div className=''></div>
      <div className='creations-panel__file-desc-group'>
        <h1 className='creations-panel__file-desc-label'>featured drop</h1>
        <select
          value={''}
          onChange={handleFeaturedDropChange}
          className='creations-panel__file-desc-field'
        >
          {drops.map((drop, i) => {
            return (
              <option value={drop.id}>
                [{drop.id}] '{drop.name}' by {drop.NftContract.Artist.username}
              </option>
            );
          })}
        </select>
      </div>
      <div className='creations-panel__file-desc-group'>
        <h1 className='creations-panel__file-desc-label'>welcome message</h1>
        <textarea
          value={''}
          onChange={handleWelcomeMessageChange}
          className='creations-panel__file-desc-field'
          maxLength={500}
        />
      </div>
      <button
        disabled={isUpdatingConfig}
        className='creations-panel__submit-button'
        type='button'
        onClick={handleSaveButtonClick}
      >
        {isUpdatingConfig ? <LoaderSpinner /> : `save changes`}
      </button>
    </div>
  );
}

import { useGetConfigQuery, useUpdateConfigMutation } from '@/store/dashboardReducer';
import { useGetApprovedDropsQuery } from '@/store/dropsReducer';
import { useEffect, useState } from 'react';
import LoaderDots from '../LoaderDots';
import LoaderSpinner from '../LoaderSpinner';

export function ConfigPanel() {
  const { data: drops, isFetching: isFetchingDrops } = useGetApprovedDropsQuery();
  const { data: config, isFetching: isFetchingConfig } = useGetConfigQuery();
  const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateConfigMutation();
  const [featuredDropId, setFeaturedDropId] = useState<number>(0);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  useEffect(() => {
    setFeaturedDropId(config.featuredDropId);
    setWelcomeMessage(config.welcomeMessage);
  }, []);

  const handleFeaturedDropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFeaturedDropId(Number(e.target.value));
  };

  const handleWelcomeMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWelcomeMessage(e.target.value);
  };

  const handleSaveButtonClick = async () => {
    await updateConfig({ featuredDropId, welcomeMessage });
  };

  if (isFetchingConfig || isFetchingDrops) {
    return <LoaderDots />;
  }

  return (
    <div style={{ width: '30%', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className='creations-panel__file-desc-group' style={{ marginTop: '25px' }}>
        <h1 className='creations-panel__file-desc-label'>featured drop</h1>
        <select
          value={featuredDropId}
          onChange={handleFeaturedDropChange}
          className='creations-panel__file-input-field'
        >
          <option value={0}> -- latest -- </option>
          {drops.map((drop, i) => {
            return (
              <option value={drop.id}>
                [{drop.id}] '{drop.name}' by {drop.NftContract.Artist.username}
              </option>
            );
          })}
        </select>
      </div>
      <div className='creations-panel__file-desc-group' style={{ marginTop: '25px' }}>
        <h1 className='creations-panel__file-desc-label'>welcome message</h1>
        <textarea
          value={welcomeMessage}
          onChange={handleWelcomeMessageChange}
          className='creations-panel__file-desc-field'
          maxLength={500}
        />
      </div>
      <div className='creations-panel__file-desc-group' style={{ marginTop: '25px' }}>
        <button
          disabled={isUpdatingConfig}
          className='creations-panel__submit-button'
          type='button'
          onClick={handleSaveButtonClick}
        >
          {isUpdatingConfig ? <LoaderSpinner /> : `save changes`}
        </button>
      </div>
    </div>
  );
}

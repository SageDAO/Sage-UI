import { PresetDrop, useGetPresetDropsQuery } from '@/store/dropsReducer';
import { useState } from 'react';
import LoaderDots from '../LoaderDots';

export default function PresetDropsPanel() {
  const { data: presetDrops, isLoading, isError } = useGetPresetDropsQuery();
  const [duration, setDuration] = useState<number>(24);
  const selectedDrops = [];

  const handleCheckboxChange = (drop: PresetDrop, isChecked: boolean) => {
    if (isChecked) {
      selectedDrops.push(drop);
    } else {
      var index = selectedDrops.indexOf(drop);
      if (index !== -1) {
        selectedDrops.splice(index, 1);
      }
    }
  };

  const handleDurationSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const val = (e.target as HTMLSelectElement).value;
    setDuration(Number(val));
  };

  const handleCreateDropsButtonClick = () => {
    if (selectedDrops.length == 0) {
      alert('Select one or more drops!');
      return;
    }
  };

  if (isLoading) {
    return <LoaderDots />;
  }
  if (isError) {
    return (
      <div style={{ marginTop: '15px' }}>
        Unable to load preset data from AWS S3. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexFlow: 'wrap' }}>
        {presetDrops.map((drop: PresetDrop, i: number) => {
          return (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <label>
                <img src={drop.bannerS3Path} width={300} />
                <br />
                <input
                  type='checkbox'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxChange(drop, e.target.checked)
                  }
                />{' '}
                {drop.dropName}
              </label>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: '25px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '400px',
          textAlign: 'center',
        }}
      >
        Drop duration:{' '}
        <select value={duration} onChange={handleDurationSelectChange}>
          <option value='24'>24 hours</option>
          <option value='48'>48 hours</option>
          <option value='168'>1 week</option>
          <option value='336'>2 weeks</option>
          <option value='672'>4 weeks</option>
        </select>
        <br />
        <br />
        <button className='games-modal__place-bid-button' onClick={handleCreateDropsButtonClick}>
          create selected drops
        </button>
      </div>
    </>
  );
}

import System, { SystemTypes } from '@/components/Icons/System';
interface Props {
  editionSize: number;
  systemType: SystemTypes;
}
export default function TileHeader({ editionSize, systemType }: Props) {
  return (
    <div className='drop-page__grid-item-header'>
      <h1 className='drop-page__grid-item-header-left'>editions {editionSize}</h1>
      <div className='drop-page__grid-item-header-right'>
        system:
        <div className='drop-page__grid-item-systems-icon'>
          <System type={systemType}></System>
        </div>
      </div>
    </div>
  );
}

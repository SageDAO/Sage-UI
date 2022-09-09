import System, { SystemTypes } from '@/components/Icons/System';
interface Props {
  editionSize: number;
  systemType: SystemTypes;
}
export default function TileHeader({ editionSize, systemType }: Props) {
  const isOneOfOne: boolean = editionSize === 1;
  const editionsText: string = isOneOfOne ? '1 of 1' : `${systemType} of ${editionSize} Editions`;
  return (
    <div className='drop-page__grid-item-header'>
      <h1 className='drop-page__grid-item-header-left'>{editionsText}</h1>
      <div className='drop-page__grid-item-header-right'>
        system:
        <div className='drop-page__grid-item-systems-icon'>
          <System type={systemType}></System>
        </div>
      </div>
    </div>
  );
}

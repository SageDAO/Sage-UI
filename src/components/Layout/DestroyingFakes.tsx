import Image from 'next/image';
export default function DestroyingFakes() {
  return (
    <div className='layout__destroying-fakes'>
      <Image draggable={false} src='/branding/destroying-fakes.svg' width={19} height={384}></Image>
    </div>
  );
}

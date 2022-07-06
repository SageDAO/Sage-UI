import Loader from 'react-loader-spinner';

export default function LoaderDots() {
  return (
    <div style={{ margin: '25px auto 25px' }}>
      <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
    </div>
  );
}

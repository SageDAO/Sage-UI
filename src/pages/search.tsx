import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();
  const query = router.query.q;
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>Search Results for '{query}' (WIP)</div>
  );
}

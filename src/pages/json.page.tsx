import { useState } from "react";

export default function json() {

  const [path, setPath] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [contract, setContract] = useState<string>('');
  
    async function go() {
      const response = await fetch(`/api/nfts?action=DeployContractMetadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistAddress: artist, contractAddress: contract }),
      });
      const { metadataURL } = await response.json();
      setPath(metadataURL);
      console.log(response);
    }

    return <div style={{ width: '50%', textAlign: 'center'}}>
      artist: <input onChange={(e) => setArtist(e.target.value)} size={100} />
      <br/><br/>
      contract: <input onChange={(e) => setContract(e.target.value)} size={100} />
      <br/><br/>
      <button onClick={go}>send</button>
      <br/><br/>
      response: <input value={path} size={100} />
    </div>


}
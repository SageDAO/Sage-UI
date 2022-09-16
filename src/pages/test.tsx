export default function test() {
  var file = null;

  async function handleClick(e: any) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const result = await fetch('/api/tiffUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'image/tiff' },
      body: formData,
    });
    console.log(result);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    file = e.target.files[0];
  }

  return (
    <form>
      <br />
      <br />
      file:
      <input type='file' name='file' style={{ border: '1px solid red', width: '150px' }} onChange={handleFileChange} />
      <button onClick={handleClick}> CLICK HERE </button>
    </form>
  );
}

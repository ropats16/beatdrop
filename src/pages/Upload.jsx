import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context";
import { postAsset } from "../lib/post";
import Modal from "../components/Modal";

function Upload() {
  const { profile } = useContext(GlobalContext);

  const [files, setFiles] = useState(null);
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState("");
  const [art, setArt] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState("");

  const artTemp = [
    "https://arweave.net/claOMpHwq99nMhO5tf5f3p5lq5VAtWX-tGeXmDvICRM",
    "https://arweave.net/Uui8HyMuB4UbV3OynrBmDvkTmMV4WzPBS9zO_PaSBlA",
    "https://arweave.net/RWVEaZeLZXoloM6AQmrvpTrk3u8MCx364IhT-UUddu8",
  ];

  const notValid = !(files && title !== "");

  const dropBeat = async (e) => {
    e.preventDefault();
    const asset = {
      file: files[0],
      title,
      topics,
      artWork: art,
      username: profile.name, // check this line, `profile` might need to be stored in a state variable
      userid: profile.contract_id,
    };

    try {
      console.log("Deploying...");
      setLoading("Deploying...");
      setIsOpen(true);
      const result = await postAsset(asset);
      e.target.reset();
      setFiles(null);
      setTitle("");
      setTopics("");
      setLoading("Deployed successfully...");
      console.log("this is the upload result", result);
      // setIsOpen(false);
      console.log("Deploying successfully...");
    } catch (e) {
      setLoading("Error deploying...", e.message);
      console.log("Error deploying...", e.message);
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Pick a random image from the array when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * artTemp.length);
    setArt(artTemp[randomIndex]);
  }, []);

  console.log("Title", title);

  return (
    <div className="h-screen w-screen bg-white">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} text={loading} />
      <form
        className="h-screen flex flex-col justify-center items-center"
        onSubmit={dropBeat}
      >
        <div className="flex flex-col justify-center bg-red mt-20">
          <div>
            {files && files[0] ? (
              <div className="flex flex-col items-center">
                <img
                  src={art}
                  className="w-40 h-40 mb-8 rounded-lg drop-shadow-xl"
                />
                <audio controls src={URL.createObjectURL(files[0])}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => setFiles(null)} className="link">
                    clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-control">
                <label htmlFor="file" className="label">
                  Audio Track
                </label>
                <input
                  id="file"
                  type="file"
                  className="input input-bordered bg-gray-200"
                  onChange={handleFileChange}
                  accept="audio/*"
                  required
                />
              </div>
            )}
          </div>
          <div>
            <div className="form-control">
              <label htmlFor="title" className="label">
                Title *
              </label>
              <input
                id="title"
                className="input input-bordered bg-gray-200"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="topics" className="label">
                Hashtags
              </label>
              <input
                id="topics"
                className="input input-bordered bg-gray-200"
                onChange={(e) => setTopics(e.target.value)}
              />
              <p className="label text-sm text-gray-400">
                Enter a comma-separated list topics (e.g. collection, category,
                etc)
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <button disabled={notValid} className="btn btn-block">
                Create Post
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* Upload
      <audio controls>
        <source src="" type="audio/mp3" />{" "}
      </audio> */}
    </div>
  );
}

export default Upload;

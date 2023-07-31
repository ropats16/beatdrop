import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context";
import { postAsset } from "../lib/post";
import Modal from "../components/Modal";

function Upload() {
  // Global profile variable
  const { profile } = useContext(GlobalContext);
  // temp storage for asset information
  const [files, setFiles] = useState(null);
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState("");
  const [art, setArt] = useState();
  // temp variables for error handling and ui
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState("");
  // array of dummy art for music
  const artTemp = [
    "https://arweave.net/claOMpHwq99nMhO5tf5f3p5lq5VAtWX-tGeXmDvICRM",
    "https://arweave.net/Uui8HyMuB4UbV3OynrBmDvkTmMV4WzPBS9zO_PaSBlA",
    "https://arweave.net/RWVEaZeLZXoloM6AQmrvpTrk3u8MCx364IhT-UUddu8",
  ];
  // Pick a random image from the array when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * artTemp.length);
    setArt(artTemp[randomIndex]);
  }, []);
  // handles the file loading
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
  // checks if file and title have been defined
  const notValid = !(files && title !== "");
  // function call to the post function
  const dropBeat = async (e) => {
    e.preventDefault();
    // defining asset object
    const asset = {
      file: files[0],
      title,
      topics,
      artWork: art,
      username: profile.name,
      userid: profile.contract_id,
    };
    //  try catch conditional for error handling
    try {
      setLoading("Deploying...");
      setIsOpen(true);
      // post function call
      const result = await postAsset(asset);
      // input data reset
      e.target.reset();
      setFiles(null);
      setTitle("");
      setTopics("");
      setLoading("Deployed successfully!");
      console.log("this is the upload result", result);
    } catch (e) {
      setLoading("Error deploying...", e.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-white">
      {/* Pop up to display state of our upload call */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} text={loading} />
      {/* form linked to the dropbeat function */}
      <form
        className="h-screen flex flex-col justify-center items-center"
        onSubmit={dropBeat}
      >
        <div className="flex flex-col justify-center bg-red mt-20">
          <div>
            {/* displays preview of audio file and music art */}
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
              // Input for audio file
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
          {/* Inputs for title and hashtags */}
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
            {/* Submit button */}
            <div className="mt-4 space-y-4">
              <button disabled={notValid} className="btn btn-block">
                Create Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Upload;

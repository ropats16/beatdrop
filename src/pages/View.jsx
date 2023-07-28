import { useState, useEffect } from "react";
import { getAssetData } from "../lib/queryAssets";
import { take } from "ramda";
import Like from "../components/Like";

function View() {
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    getAssetData().then((assets) => {
      setAssets(assets);
    });
  }, []);

  if (!assets) {
    return (
      <section className="hero min-h-screen bg-black flex flex-col mt-10">
        <p>Tunes may take sometime to load...</p>
        <hr className="w-1/2 mt-2" />
      </section>
    );
  }

  return (
    <section className="hero min-h-screen bg-black flex flex-col mt-10">
      <p>Tunes may take sometime to load...</p>
      <hr className="w-1/2 mt-2" />
      {assets.length > 0 ? (
        <div className="flex-col">
          {assets.map((asset, key) => (
            <div
              key={key}
              className="hero-content my-5 flex-col md:space-x-4 border-solid border-2 border-slate-300 rounded-lg"
            >
              <div className="w-7/8 px-0 mx-0 grid place-items-center">
                {asset.type === "audio" && (
                  <audio
                    className="w-[350px] object-contain rounded-lg"
                    src={asset.audio}
                    alt={asset.title}
                  >
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                )}
              </div>
              <div className="w-[350px] flex flex-row items-center justify-between">
                <div className="w-7/8 mx-0">
                  <div className="flex justify-between">
                    <p className="text-md">
                      {asset.ownername ? asset.ownername : take(5, asset.owner)}
                      <strong className="text-lg">{asset.title}</strong>
                    </p>
                  </div>
                  {asset.topics.length > 0 && (
                    <p className="text-sm text-gray-400">
                      Hashtags: {asset.topics.join(", ")}
                    </p>
                  )}
                </div>
                <Like id={asset.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Drop a beat first!</div>
      )}
    </section>
  );
}

export default View;

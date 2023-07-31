import { useState, useEffect } from "react";
import { getAssetData } from "../lib/queryAssets";
import { take } from "ramda";
import Like from "../components/Like";

function View() {
  // temp storage to store information received from queryAssets
  const [assets, setAssets] = useState(null);
  // useEffect fetches the latest assets each tme our page reloads
  useEffect(() => {
    getAssetData().then((assets) => {
      setAssets(assets);
    });
  }, []);
  // Placehoder text till the assets are fetched
  if (!assets) {
    return (
      <div className="h-screen w-screen bg-white">
        <p>Beats may take sometime to load...</p>
      </div>
    );
  }

  return (
    <section className="h-screen w-screen bg-white">
      {assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 my-16 mx-20 justify-center">
          {assets.map((asset, key) => (
            // renders a card for each asset
            <div
              key={key}
              className="h-96 p-5 my-5 flex flex-col items-center justify-center bg-stone-950 drop-shadow-lg rounded-2xl p-3"
            >
              {/* music artwork */}
              <img
                className="h-40 mx-auto mb-5 rounded-md"
                src={asset.artWork}
                alt="music art"
              />
              {/* audio content with controls, the ui depends on browsers */}
              <div>
                {asset.type === "audio" && (
                  <audio controls src={asset.audio} alt={asset.title}>
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                )}
              </div>
              {/* Music title, creator, hashtags */}
              <div className="flex flex-row items-center justify-between px-6 mt-2 w-full">
                <div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm">
                      <strong className="text-lg text-white">
                        {asset.title}
                      </strong>
                    </p>
                    <p className="text-sm">
                      Artist:{" "}
                      {asset.ownername ? asset.ownername : take(5, asset.owner)}
                    </p>
                  </div>
                  {asset.topics.length > 0 && (
                    <p className="text-sm">
                      Hashtags: {asset.topics.join(", ")}
                    </p>
                  )}
                </div>
                {/* Component to like the asset/ music */}
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

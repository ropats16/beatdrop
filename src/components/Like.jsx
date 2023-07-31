import { useState, useEffect, useContext } from "react";
import { readContractWOthent, writeContractWOthent } from "arweavekit/contract";
import { GlobalContext } from "../context";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Like = ({ id }) => {
  // Global profile variable
  const { profile } = useContext(GlobalContext);
  // variable to store likes
  const [likes, setLikes] = useState({});
  // function to interact with contract using othent and like a post
  async function likePost() {
    await writeContractWOthent({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
      othentFunction: "sendTransaction",
      data: {
        toContractId: id,
        toContractFunction: "likePost",
        txnData: {
          function: "likePost",
        },
      },
    });
    const updatedLikes = await readLikes();
    setLikes(updatedLikes);
  }
  // function to read the current state of a contract
  async function readLikes() {
    const res = await readContractWOthent({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
      contractTxId: id,
    });
    return res.state["likes"];
  }
  // useEffect fetches the current state of likes associated with a post
  // this uses the id passed in as a prop
  useEffect(() => {
    const fetchLikes = async () => {
      const initialLikes = await readLikes();
      setLikes(initialLikes);
    };
    fetchLikes();
  }, [id]);
  // checks if a profile/ user has already liked a post
  const isDisabled = Object.keys(likes).includes(profile.contract_id);

  return (
    <div className="flex items-center gap-2">
      <p className="text-center">{Object.keys(likes).length}</p>
      <button className="btn" disabled={isDisabled} onClick={likePost}>
        {/* checks if the button should be disabled and displays the current icon */}
        {isDisabled ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default Like;

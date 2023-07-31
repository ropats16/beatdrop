// imports
import { queryAllTransactionsGQL } from "arweavekit/graphql";
import { pluck, filter } from "ramda";

// function to fetch posts create from defined contract source
export async function getAssetData() {
  // initialising empty array
  let assets = [];

  // fetch request
  await queryAllTransactionsGQL(query, {
    gateway: "arweave.net",
    filters: {},
  }).then((data) =>
    data.map((edges) => {
      // creating object of relevant data for each asset and pushing to 'assets' array
      // contains transaction id, web url for image, title, description, content type, topics (hashtags), post owner, timestamp
      assets.push({
        id: edges.node?.id,
        audio: `https://arweave.net/${edges.node?.id}`,
        title: edges.node.tags.find((t) => t.name === "Title")?.value,
        artWork: edges.node.tags.find((t) => t.name === "ArtWork")?.value,
        type: edges.node.tags.find((t) => t.name === "Type")?.value,
        topics: pluck(
          "value",
          filter((t) => t.name.includes("Topic:"), edges.node.tags)
        ),
        owner:
          edges.node.tags.find((t) => t.name === "Creator")?.value ||
          edges.node.owner.address,
        ownername: edges.node.tags.find((t) => t.name === "Creator-Name")
          ?.value,
        timestamp: edges.node?.block?.timestamp || Date.now() / 1000,
      });
    })
  );

  // returns 'assets' array on function call
  return assets;
}

// query requesting posts referencing the defined contract source
const query = `
query{
  transactions(tags: [
  { name: "Contract-Src", values: ["DG22I8pR_5_7EJGvj5FbZIeEOgfm2o26xwAW5y4Dd14"] }
  ] first: 100) {
edges {
  node {
    id
    owner {
      address
    }
    tags {
      name
      value
    }
    block {
      timestamp
    }
  }
}
}
}

`;

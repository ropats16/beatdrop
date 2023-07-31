# Welcome to Beatdrop

We will build a music library connecting musicians to the world. Musicians can drop a beat, which will be uploaded to [Arweave](https://arweave.org/). Users can also jam to beats uploaded on the app.

## Creating a new application

Let's start by creating a new application using vite, react and tailwindcss:

```bash
npm create vite@latest beatdrop -- --template react
```

And navigate to the app folder

```bash
cd beatdrop
```

A few dependency help with compatibility and smooth functioning of our app. Let's open our app in a dedicated code environment and setup the same.

```bash
npm install -D os-browserify path-browserify vite-plugin-node-polyfills vite-plugin-notifier
```

Then replace the code in `vite.config.js` with the following:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      process: "process/browser",
      path: "path-browserify",
      os: "os-browserify",
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        "fs", // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
});
```

## Setting up TailwindCSS

The first step of the setup is to install the dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer daisyui
```

Now we generate the tailwind config files:

```bash
npx tailwindcss init -p
```

Then paste the following in `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster"],
      },
    },
  },
  plugins: [daisyui],
};
```

Finally delete the `App.css` file in the `src` folder and replace with the following in the `index.css` file:

```css
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;
```

> Note: Some styling has been added throughout the app for better UI/ UX.

## Adding Dependencies to Interact with Arweave

These dependencies make interacting with Arweave a breeze and make our application user friendly.

- [ArweaveKit](https://www.arweavekit.com/) is a one-stop library for using Arweave. It includes functions for wallets, transactions, contracts, authentication querying data from the network and encryption.
- [Othent](https://othent.io/) enables users to connect to applications and interact with Arweave using their familiar gmail accounts and more. Othent is one of the libraries ArweaveKit uses under the hood.

To install, we simply run:

```bash
npm install arweavekit warp-contracts warp-contracts-plugin-deploy
```

## Implementing Authentication

Users need a way to interact with our application, so we will start off authentication. There's two ways they can do so. Log in and log out features through a navigation bar and logging in through a call-to-action button on the landing page.

Let's start off with a Navbar.

### Creating a Navbar

The navbar is a component so we create a `components` folder in `src` and create a file name `Navbar.jsx` within it.

We define and arrow component:

```jsx
const Navbar = () => {};

export default Navbar;
```

Then we import some dependencies in our file and implement the authentication functions as follows:

```jsx
import { Buffer } from "buffer/";
import { Othent } from "arweavekit/auth";

const Navbar = () => {
  // Log in function
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
  }
  // Log out function
  async function handleDisconnect() {
    await Othent.logOut({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
  }
};

export default Navbar;
```

The `Buffer` dependency is meant to help with compatibility and smooth functioning of our app in a browser environment.

`Othent` from arweavekit's `auth` utility gives us access to features like log in and log out. But for this to work we need an `API_ID`.

#### Handling API IDs

For the functions to successfully leverage Othent, we need to quickly fetch an API ID from [here](https://othent.io/). Login to the page using the button on the top right. Then scroll to the bottom to the `Get your API ID` section and copy the same.

The API ID must be safely handled in order to prevent anyone from misusing or spamming you ID. The best way to handle them is with the help of environment variables.

For this we create a file in the root folder named `.env` and enter our API IP as follows:

```env
VITE_OTHENT_API_ID="YOUR_API_ID"
```

Every environment variable in Vite apps need to follow the format `VITE_VAR_NAME` for Vite to correctly identify the variable.

#### Creating a Global Context

With the API ID setup, we need to create a global variable that can be used across all the pages in our app. This lets us access user data and permissions throughout.

To start, we create a file named `context.js` is the `src folder and create a new context within it as follows:

```js
import { createContext } from "react";

export const GlobalContext = createContext();
```

Now we wrap our app with this context in `App.jsx` and import the `Navbar` component in it as follows:

```jsx
import Navbar from "./components/Navbar";
import { GlobalContext } from "./context";
import { useState } from "react";

function App() {
  const [profile, setProfile] = useState();
  return (
    <div className="m-0 p-0 h-screen w-screen">
      <GlobalContext.Provider
        value={{
          profile,
          setProfile,
        }}
      >
        <Navbar />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
```

The `Global Context Provider` gives the entire application access to the `profile` variable and `setProfile` function.

With the app wrapped in the context we head back to the `Navbar`. On successful login the function returns the connected user's details. We will assign this value to the global `profile` variable.

```jsx
import { Buffer } from "buffer/";
import { Othent } from "arweavekit/auth";
import { useContext } from "react";
import { GlobalContext } from "../context";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Global profile variable and setProfile function
  const { profile, setProfile } = useContext(GlobalContext);
  // Log in function
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }
  // Log out function
  async function handleDisconnect() {
    await Othent.logOut({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(null);
  }
};

export default Navbar;
```

We have the `handleConnect` function for login and the `handleDisconnect` to handle the logout process. Upon successful logout, the user details are reset to `null`.

Now we need a way to call these functions on the frontend so we create some UI for the `Navbar`

```jsx
// imports and Navbar logic...
return (
  <div className="navbar bg-black drop-shadow-md h-14 fixed top-0 fixed top-0 z-50">
    <div className="navbar-start">
      {/* Hamburger dropdown to toggle between various pages of the app */}
      <div className="dropdown dropdown-hover">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <ul className="dropdown-content menu p-2 shadow bg-black rounded-box w-52">
          <li>
            <Link to="/upload">Drop a beat</Link>
          </li>
          <li>
            <Link to="/view">Jam to beats</Link>
          </li>
        </ul>
      </div>
    </div>
    {/* Title of the app linking to the Home page */}
    <div className="navbar-center md:flex">
      <Link
        to="/"
        className="btn btn-ghost normal-case text-3xl font-lobster text-white"
      >
        BeatDrop
      </Link>
    </div>
    {/* A Log in button or the connected user details and a button to Log out */}
    <div className="navbar-end md:flex gap-4">
      {profile ? (
        <div className="flex justify-evenly items-center gap-2">
          <img src={profile.picture} className="w-12 h-12 rounded-md" />
          <button className="btn btn-ghost" disabled>
            {profile.name}
          </button>
          <button className="btn btn-ghost" onClick={handleDisconnect}>
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={handleConnect} className="btn btn-ghost">
          Log In
        </button>
      )}
    </div>
  </div>
);
```

### Creating a Home Page

With the `Navbar` done we want our users to have a introduction page. It will include the app name, a short tag line and another login button. We do so by creating a new folder named `pages` within `src` and add a file named `Home.jsx` with the following code:

```jsx
import { Othent } from "arweavekit/auth";
import { useContext } from "react";
import { GlobalContext } from "../context";

function Home() {
  // Global setProfile function
  const { setProfile } = useContext(GlobalContext);
  // Log in function
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }
  return (
    <div className="h-full w-full bg-white">
      <div className="h-full hero-content flex-col space-y-8">
        <h1 className="text-8xl font-bold hover:text-primary font-lobster self-center">
          BeatDrop
        </h1>
        <p className="text-2xl text-center">
          A decentralised audio sharing application on Arweave <br /> that
          allows you to drop beats <br /> as atomic assets.
        </p>
        <div className="flex space-x-4">
          <button className="btn btn-secondary" onClick={handleConnect}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
```

And now we add the `Home` Page to our app:

```jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import View from "./pages/View";
import { GlobalContext } from "./context";
import { useContext, useEffect, useState } from "react";

// function to redirect users upon log in and log out
const ProfileRedirect = () => {
  // Global setProfile function
  const { profile } = useContext(GlobalContext);
  // react hook for page navigation
  const navigate = useNavigate();

  // useEffect checks for profile and routes to either the View or Home page
  useEffect(() => {
    if (profile) {
      navigate("/view");
    } else {
      navigate("/");
    }
  }, [profile]);

  return null;
};

function App() {
  // Global profile variable and setProfile function
  const [profile, setProfile] = useState();

  return (
    <Router>
      <div className="m-0 p-0 h-screen w-screen">
        <GlobalContext.Provider
          value={{
            profile,
            setProfile,
          }}
        >
          <ProfileRedirect />
          <Navbar />
          {/* routing between pages */}
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </GlobalContext.Provider>
      </div>
    </Router>
  );
}

export default App;
```

We are using routing to switch between pages. For this to work let's install another dependency:

```bash
npm install react-router-dom
```

One more thing before we actually visualize our code, let us create some dummy `View` and Upload` pages so that the build does not throw errors and we're able to test the routing, as well.

```jsx
function View() {
  return <h1 className="mt-20">View</h1>;
}

export default View;
```

Do the same for the `Upload` page.

Now let's run a dev environment to see this:

```bash
npm run dev
```

This will point you to a URL to view the output in the browser. We can see our Navbar and Home Page with the login features. We are pointed to the `View` page upon successful login. However, to view stuff we first need to upload some beats.

## Posting to Arweave

Let's work on our ability to upload some beats to Arweave.

### Helper function for posting

First we need to create a supporting function. We'll do this in a folder named `lib` within `src` and call the file `post.js`:

```js
// imports
import { split, map, trim } from "ramda";
import { WarpFactory } from "warp-contracts";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import { createAndPostTransactionWOthent } from "arweavekit/transaction";

// transaction id of contract source
const SRC = "DG22I8pR_5_7EJGvj5FbZIeEOgfm2o26xwAW5y4Dd14";

// function to convert input audio to type `ArrayBuffer`
// takes in audio file
const toArrayBuffer = (file) =>
  new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (evt) => {
      resolve(evt.target.result);
    });
  });

// function to post asset to network using othent as authentication
// takes in 'asset' information
export async function postAsset(asset) {}
```

![Atomic Assets]()

We'll be using a unique data type called Atomic Assets, that combine the primary data, metadata and a smart contract to modify these into a single unbreakable (atomic) unit where all three pieces are referenced with a single `transaction ID`.

![SmartWeave Contracts]()

With SmartWeave contracts we are also able to leverage a unique programming pattern where a single contract can be defined on chain and used as the source logic for multiple instances. This is possible through an evaluation mechanism known as "Lazy evaluation".

![Lazy Evaluation]()

Rather than having each node varify each interaction, when a user wishes to interact with a SmartWeave contract, they evaluate the contract's current state with the source logic, the initial state and previous list of interactions before ssubmitting their own. As nodes are not involved, these interactions are completely free as well!

Back to the code, we're going to create some metadata and attach that to our primary data while uploading:

```js
// imports and help functions..

// function to post asset to network using othent as authentication
// takes in 'asset' information
export async function postAsset(asset) {
  // converts file to `ArrayBuffer`
  const data = await toArrayBuffer(asset.file);

  // array of input tags
  const inputTags = [
    // Content mime (media) type (For eg, "audio/mp3")
    { name: "Content-Type", value: asset.file.type },
    // Help network identify post as SmartWeave Contract/ Atomic Asset
    { name: "App-Name", value: "SmartWeaveContract" },
    { name: "App-Version", value: "0.3.0" },
    // Link data/ contract instance to contract source
    { name: "Contract-Src", value: SRC },
    // Initial state for our post (as a contract instance)
    {
      name: "Init-State",
      value: JSON.stringify({
        creator: asset.userid,
        owner: asset.userid,
        ticker: "BEATDROP-ASSET",
        balances: {
          [asset.userid]: 10000,
        },
        contentType: asset.file.type,
        likes: {},
      }),
    },
    { name: "Creator-Name", value: asset.username },
    // Standard tags following ANS-110 standard for discoverability of asset
    { name: "Creator", value: asset.userid },
    { name: "Title", value: asset.title },
    { name: "ArtWork", value: asset.artWork },
    { name: "Type", value: "audio" },
  ];

  // adding hashtags passed in by users to the 'inputTags' array
  map(trim, split(",", asset.topics)).forEach((t) => {
    inputTags.push({ name: "Topic:" + t, value: t });
  });

  // function call to create post using othent for signing
  const transaction = await createAndPostTransactionWOthent({
    apiId: import.meta.env.VITE_OTHENT_API_ID,
    othentFunction: "uploadData",
    data: data,
    tags: inputTags,
    useBundlr: true,
  });

  // intiating new warp instance for mainnet
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());

  // registering transaction with warp
  const { contractTxId } = await warp.register(
    transaction.transactionId,
    "node1"
  );

  // returns the success status and transaction id of the post
  return transaction;
}
```

Some standard tags help the network identify the asset and data type while others are custom tags that will help us with querying the data later on.

The `initState` defines the intial state that the contract will be created with.

We register our asset with warp to view it in their dedicated explorer, Sonar.

### Calling the helper function on the frontend

Now let's implement this on our `Upload` page:

```jsx
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
}

export default Upload;
```

This initial setup helps us with the function call. We're setting up handlers for our form and the status of our upload request.

Now for the actual function call:

```jsx
// imports and supporting functions...
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
```

And finally a UI to interact with this:

```jsx
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
```

### Defining a Modal

Here's the code for the modal that will display the status of our request in a new component file called `Modal.jsx`:

```jsx
import { Link } from "react-router-dom";
// props to help modal
const Modal = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;
  // Modal is displayed only when isOpen is true
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center justify-center">
            {/* Cool gif */}
            <img
              src="https://g8way.io/IkMJRqi_0Xx_QhstK4WE3rsQqQxC07n84UagPgqGXfc"
              alt="Modal"
              className="w-48 object-cover mb-4"
            />
            {/* Text displaying status of upload call */}
            <div className="text-center mb-4">{text}</div>
            {/*  */}
            {text === "Deployed successfully..." ? (
              <button className="btn btn-ghost text-center">
                <Link to="/view">View Posts</Link>
              </button>
            ) : null}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-center">
            {/* button to close modal */}
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

And now let's see this in action! Head over to the browser...

## Fetching posts

Now that we have posted something to the network, we want to search for it and show it on the front end.

We're going to use ArweaveKit's `graphql` features for the same.

### Defining the query and functions to fetch

So let us create a helper that queries our posts. For this we make a new file in `src/lib` named `queryAssets`.

This how the query looks:

```js
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
```

Now using this query we make a request to the network with the help of the `queryAllTransactionsGQL`. This queries for all the transactions having the filters we specify (i.e. the contract source tag).

This is how the function is called:

```js
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

// query definition...
```

After getting a response from the function we also perform some cleanup, cherry picking the information we want to render on the frontend. We then return this an array of objects called `assets`.

### Rendering assets on the frontend

Now let's render this on our `View` page.

The view function is pretty straight forward:

```jsx
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
}

export default View;
```

And then the ui:

```jsx
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
                  <p className="text-sm">Hashtags: {asset.topics.join(", ")}</p>
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
```

## Adding Likes on chain

One last feature we have to implement is the ability for users to `Like` the music. We create a component named `Like` and paste the following code:

```jsx
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
      {/* displays total number of likes for a post */}
      <p className="text-center">{Object.keys(likes).length}</p>
      <button className="btn" disabled={isDisabled} onClick={likePost}>
        {/* checks if the button should be disabled and displays the current icon */}
        {isDisabled ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default Like;
```

The like component implements functions to interact with a contract and add a like on chain and fetch these likes.

Now let's checkout our posts on the frontend.

Voila!

Great job building a fullstack dApp on Arweave using ArweaveKit!

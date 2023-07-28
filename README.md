# Welcome to Beatdrop

We will build a music library connecting musicians and patrons. Musicians can drop a beat, which will be uploaded to [Arweave](https://arweave.org/). Users can also jam to beats uploaded on the app.

## Creating a new application

Let's start by creating a new application using vite, react and tailwindcss:

```bash
npm create vite@latest beatdrop -- --template react
```

And navigate to the app folder

```bash
cd beatdrop
```

A few dependency help with compatibility and smooth functioning of our app.

```bash
npm install buffer process
```

Then replace the code in `index.html` with the following:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script>
      window.global = window;
    </script>
    <script type="module">
      import { Buffer } from "buffer/"; // <-- no typo here ("/")
      import process from "process";

      window.Buffer = Buffer;
      window.process = process;
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

And the following in `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      process: "process/browser",
    },
  },
  plugins: [react()],
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

Finally delete the `App.css` file and its imports and paste the following in the `index.css` file:

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
- [Othent](https://othent.io/) enables users to connect to applications and interact with Arweave using their familiar gmail accounts and more. Othent is one of the utilities ArweaveKit abstracts under the hood.

To install, we simply run:

```bash
npm install arweavekit
```

## Implementing Authentication

Users need a way to interact with our application, so we will start off authentication. There's two ways they can do so. Log in and log out features through a navigation bar and logging in through a CTA button on the landing page.

Let's start off with a Navbar.

### Creating a Navbar

The navbar is a component so we create a `components` folder in `src` and create a file name `Navbar.jsx` within it.

We define and arrow component:

```jsx
const Navbar = () => {};

export default Navbar;
```

In order to implement login and logout, we need to import the dependency in our file:

```jsx
import { Buffer } from "buffer/";
import { Othent } from "arweavekit/auth";

const Navbar = () => {};

export default Navbar;
```

The `Buffer` dependency is meant to help with compatibility and smooth functioning of our app in a browser environment.

`Othent` from arweavekit's `auth` utility gives us access to features like log in and log out. We then implement these functions as follows:

```jsx
import { Buffer } from "buffer/";
import { Othent } from "arweavekit/auth";

const Navbar = () => {
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
  }

  async function handleDisconnect() {
    await Othent.logOut({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
  }
};

export default Navbar;
```

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

const Navbar = () => {
  const { profile, setProfile } = useContext(GlobalContext);
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }

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
// imports and Navbar logic
return (
  <div className="navbar bg-black drop-shadow-md h-14 fixed top-0 fixed top-0 z-50">
    <div className="navbar-start">
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
            <a href="/upload">Drop a beat</a>
          </li>
          <li>
            <a href="/view">Jam to beats</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="navbar-center md:flex">
      <a
        href="/"
        className="btn btn-ghost normal-case text-3xl font-lobster text-white"
      >
        BeatDrop
      </a>
    </div>
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

With the `Navbar` done we want our users to have a introduction page. It will include the app name, a short tag line and another login button.

```jsx
import { Othent } from "arweavekit/auth";
import { useContext } from "react";
import { GlobalContext } from "../context";

function Home() {
  const { setProfile } = useContext(GlobalContext);
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }
  return (
    <div className="h-full w-full bg-white">
      <div className="h-full hero-content flex-col space-y-8">
        <h1 className="text-8xl font-bold hover:text-primary font-lobster">
          BeatDrop
        </h1>
        <p className="text-2xl text-center">
          A decentralised image sharing application on Arweave <br /> that
          allows you to post your images <br /> as atomic assets.
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

const ProfileRedirect = () => {
  const { profile } = useContext(GlobalContext);
  const navigate = useNavigate();

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

We are using routing to switch between some pages. Mainly, the `View` and `Upload`. The user is pointed to the `View` page upon successful login. However, to view we first need to upload some tunes.

Let's work on our `Upload` page.

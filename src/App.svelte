<script>
  import { Route } from "tinro";
  import { getCookie } from "./utils/cookie";
  import Header from "./components/Header.svelte";
  import NotFound from "./containers/NotFound.svelte";
  import Home from "./containers/Home/Home.svelte";
  import { onMount } from "svelte";
  import request, {
    makeApiUrl,
    makeGetReq,
    makeAuthUrl,
  } from "./utils/request";
  import Notes from "./containers/Notes/Notes.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  let user = {
    isLoggedIn: false,
  };

  onMount(async () => {
    try {
      const res = await request(makeAuthUrl(`/account/info`), makeGetReq());
      user = {
        ...res,
        isLoggedIn: true,
      };
    } catch (error) {
      console.log(error);
      window.location.href="/";
    }
  });

  let theme = localStorage.getItem("theme") || "light";
  const onThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    theme = newTheme;
  };
</script>

<style>
  @media only screen and (max-width: 1024px) {
    .base {
      margin: 0 10px;
    }
  }
  :global(a.active) {
    color: var(--primary) !important;
  }
  :global(*) {
    margin: 0px;
    padding: 0px;
    font-family: sans-serif;
  }
  :global(html),
  :global(body) {
    height: 100%;
  }
  :global(#root) {
    min-height: 100%;
    background-color: var(--background);
  }
  :global(.theme-light) {
    --primary: #d21e2b;
    --text: #333;
    --background: #fff;
    --edge: #e2dddd;
    --neutral: #9c9999;
    --link: #1a73e8;
    --sidebar-background: #fafafa;
    --sidebar-after-background: #ececec94;
  }
  :global(.theme-dark) {
    --primary: #d21e2b;
    --text: #fff;
    --background: #0e0e0e;
    --edge: #44444494;
    --neutral: #585858;
    --link: #1a73e8;
    --sidebar-background: #131313;
    --sidebar-after-background: #21212194;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css">
</svelte:head>
<div id="root" class="theme-{theme}">
  <div class="sidebar-layout">
    <!-- <Header on:themeChange={onThemeChange} /> -->
    <!-- <Home /> -->
    <Sidebar />
    <Route>
      <Route path="/notes" let:params>
        <Notes {params} />
      </Route>
      <Route path="/notes/:directoryId" let:params>
        <Notes {params}/>
      </Route>
      <Route path="/notes/:directoryId/edit" let:params>
        <Notes {params}/>
      </Route>
      <Route path="/notes/:directoryId/:noteId" let:params>
        <Notes {params}/>
      </Route>
      <Route fallback>
        <NotFound />
      </Route>
    </Route>
  </div>
</div>

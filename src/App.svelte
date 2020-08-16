<script>
  import { Route, router } from "tinro";
  import { onMount } from "svelte";
  import { getCookie } from "./utils/cookie";
  import NotFound from "./containers/NotFound.svelte";
  import request, {
    makeApiUrl,
    makeGetReq,
    makeAuthUrl,
  } from "./utils/request";
  import Sidebar from "./components/Sidebar.svelte";
  import DirectoryAdministration from "./containers/Directories/DirectoryAdministration.svelte";

  import { loadDirectories } from "./actions/directory";
  import { getUserInfo } from "./actions/auth";
  import SidePanel from "./containers/Shared/SidePanel.svelte";
  import NotesForm from "./containers/Notes/NotesForm.svelte";

  let user = {
    isLoggedIn: false,
  };

  let directories = [];
  let sidePanelRef;

  onMount(async () => {
    await loadUserInfo();
    const response = await loadDirectories();
    directories = response.payload;
  });

  const loadUserInfo = async () => {
    try {
      const response = await getUserInfo();
      user = response.payload;
    } catch (error) {
      window.location.href = "/";
    }
  };

  let theme = localStorage.getItem("theme") || "light";

  const onThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    theme = newTheme;
  };

  const onCreate = ({ detail }) => {
    switch (detail.type) {
      case "directory":
        directories = [detail.payload, ...directories];
        router.goto("/notes/directories/" + detail.payload._id);
        break;
      case "note":
        router.goto(
          "/notes/directories/" +
            detail.payload.directory._id +
            "/notes/" +
            detail.payload._id
        );
        break;
    }
  };

  const onUpdate = ({ detail }) => {
    switch (detail.type) {
      case "directory":
        directories = directories.map((x) =>
          x._id === detail.payload._id ? detail.payload : x
        );
        break;
      case "note":
        sidePanelRef.updateNote(detail.payload);
        break;
    }
  };

  const onRemove = ({ detail }) => {
    switch (detail.type) {
      case "directory":
        directories = directories.filter((x) => x._id !== detail.payload._id);
        router.goto("/notes/directories");
        break;
    }
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
  :global(.content-layout) {
    display: grid;
    margin-left: 70px;
    position: relative;
    grid-template-columns: 280px auto;
    padding: 0px 0px 0px 0px;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>
<div id="root" class="theme-{theme}">
  <div class="sidebar-layout">
    <Sidebar on:themeChange={onThemeChange} {theme} />
    <Route>
      <Route path="/notes" redirect="/notes/directories" />
      <div class="content-layout">
        <Route path="/notes/directories" let:params>
          <SidePanel on:remove={onRemove} {directories} {params} />
          <DirectoryAdministration
            {params}
            {directories}
            on:create={onCreate} />
        </Route>
        <Route path="/notes/directories/:directoryId" let:params>
          <!-- bind:this={sidePanelRef} -->
          <SidePanel on:remove={onRemove} {directories} {params} />
          <NotesForm on:create={onCreate} {params} />
        </Route>
        <Route path="/notes/directories/update/:directoryId" let:params>
          <SidePanel on:remove={onRemove} {directories} {params} />
          <DirectoryAdministration
            {params}
            {directories}
            on:update={onUpdate} />
        </Route>
        <Route path="/notes/directories/:directoryId/notes/:noteId" let:params>
          <!-- We bind here sidePanel ref because just at this route sidePanel can get updated content-->
          <SidePanel
            bind:this={sidePanelRef}
            on:remove={onRemove}
            {directories}
            {params} />
          <NotesForm {params} on:update={onUpdate} />
        </Route>
      </div>
      <!-- <Route path="/notes/:directoryId" let:params>
        <Notes {params} {directories} />
      </Route> -->
      <!-- <Route path="/notes/:directoryId/:noteId" let:params>
        <Notes {params} {directories} />
      </Route> -->
      <Route fallback>
        <NotFound />
      </Route>
    </Route>
  </div>
</div>

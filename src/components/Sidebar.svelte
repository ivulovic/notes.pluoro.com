<script>
  import Logo from "./Logo.svelte";
  import BlogIcon from "./icons/BlogIcon.svelte";
  import NoteIcon from "./icons/NoteIcon.svelte";
  function checkIsActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }
</script>

<style>
  aside {
    height: 100%;
    display: flex;
    padding: 10px 5px;
    position: fixed;
    box-sizing: border-box;
    flex-direction: column;
    background-color: var(--sidebar-background);
    justify-content: space-between;
    width: 70px;
  }
  nav,
  footer {
    padding: 0px 0px;
  }
  nav ul {
    display: grid;
    grid-template-columns: 1fr;
  }
  nav li {
    list-style: none;
    display: inline-block;
  }
  nav a {
    display: block;
    text-decoration: none;
    color: var(--neutral);
    font-weight: 500;
    padding: 10px 0px;
    letter-spacing: 0.03rem;
    border-radius: 25px;
    transition: color 0.3s ease;
  }
  nav a:hover {
    color: var(--text);
  }
  nav a.active {
    color: var(--text) !important;
  }
</style>

<aside>
  <Logo />

  <nav>
    <ul>
      <li>
        <a href="/blog" class={checkIsActive('/blog')} tinro-ignore>
          <BlogIcon />
        </a>
      </li>
      <li>
        <a href="/notes" class={checkIsActive('/notes')} tinro-ignore>
          <NoteIcon />
        </a>
      </li>
    </ul>
  </nav>

  <footer />
</aside>

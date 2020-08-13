<script>
  import Logo from "./Logo.svelte";
  function checkIsActive(path) {
    return window.location.pathname.includes(path) ? "active" : "";
  }
</script>

<style>
  aside {
    width: 250px;
    height: 100%;
    display: flex;
    padding: 10px 5px;
    position: fixed;
    box-sizing: border-box;
    flex-direction: column;
    background-color: var(--sidebar-background);
    justify-content: space-between;
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
    padding: 15px;
    letter-spacing: 0.03rem;
    border-radius: 25px;
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
        <a href="/blog" class={checkIsActive('/blog')} tinro-ignore>Blog</a>
      </li>
      <li>
        <a href="/notes" class={checkIsActive('/notes')} tinro-ignore>Notes</a>
      </li>
    </ul>
  </nav>

  <footer />
</aside>

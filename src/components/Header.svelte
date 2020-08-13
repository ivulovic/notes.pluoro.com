<script>
  import { createEventDispatcher } from "svelte";
  import Logo from "./Logo.svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .space-between {
    justify-content: space-between;
  }
  header {
    padding: 15px 0px;
    align-items: center;
  }
  nav ul {
    padding: 0px;
    margin: 0px;
    align-items: center;
  }
  nav ul li {
    list-style-type: none;
    display: inline-block;
  }
  /* nav ul li a {
    display: block;
    padding: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    color: var(--text);
    font-size: 14px;
  } */
  /* nav ul li a:hover {
    color: var(--primary) !important;
  }
  nav ul li:first-child a {
    padding-left: 0px;
  }
  nav ul li:last-child a {
    padding-right: 0px;
  } */
</style>

<header class="flex-row space-between">
  <nav>
    <ul>
      <li>
        <Logo />
      </li>
    </ul>
  </nav>
  <nav>
    <!-- <ul class="flex-row">
      <li>
        <a href="/sign-in" use:active>Sign in</a>
      </li>
    </ul> -->
  </nav>
</header>

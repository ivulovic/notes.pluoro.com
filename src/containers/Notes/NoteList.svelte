<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { active, router } from "tinro";
  import request, {
    makeApiUrl,
    makeGetReq,
    makePostReq,
  } from "../../utils/request";
  import { timeSince } from "../../utils/date";
  export let params = {};

  const dispatch = createEventDispatcher();
  let { directoryId } = params;

  export let notes = [];
  export let directories = [];

  const onDirectoryChange = (e) => {
    dispatch("directoryChange", { directoryId: e.target.value });
  };
  const onNoteRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch("noteRemove", { noteId: e.target.value });
  };
</script>

<style>
  main {
    color: var(--text);
    min-height: 100vh;
    background-color: var(--sidebar-after-background);
  }
  .header {
    display: flex;
    align-items: center;
    padding: 10px;
    justify-content: space-between;
  }
  .header select {
    border: none;
    background: transparent;
    color: var(--text);
    outline: none;
    font-weight: 500;
    font-size: 20px;
    letter-spacing: 0.03rem;
    padding: 30px 20px 30px 0px;
  }
  .header select option {
    padding: 10px;
    font-size: 16px;
    color: var(--background);
  }
  .note-list {
    display: grid;
    grid-template-columns: 1fr;
  }
  .note-list li {
    list-style: none;
  }
  :global(.note-list .active) {
    background: var(--sidebar-background);
  }
  .note-list a {
    display: block;
    padding: 15px 10px;
    text-decoration: none;
  }
  .note-list .note-title {
    font-weight: 500;
    letter-spacing: 0.03rem;
    margin-bottom: 15px;
    color: var(--text);
  }
  .note-list .note-description {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--neutral);
    font-size: 0.8rem;
  }
  button {
    color: var(--neutral);
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    z-index: 1;

    position: absolute;
    right: 0;
    z-index: 2;
    padding: 5px;
  }
  button:hover {
    color: var(--text);
  }
  .relative {
    position: relative;
  }
  .tip {
    background-color: var(--tip-color);
  }
</style>

<main>
  <div class="header">
    <select bind:value={directoryId} on:input={onDirectoryChange}>
      <option value="">Choose directory</option>
      {#each directories as directory}
        <option value={directory._id}>{directory.name}</option>
      {/each}
    </select>
    {#if directoryId}
      <div>
        <!-- <small>Update</small>
        <small>Remove</small> -->
      </div>
    {/if}
  </div>
  <ul class="note-list">
    {#if directoryId}
      <li>
        <a class="tip" href={'/notes/' + directoryId}>
          <p class="note-title">Create Note</p>
          <div class="note-description">
            <p>Click here to create new one.</p>
          </div>
        </a>
      </li>
    {/if}
    {#if notes}
      {#each notes as note}
        <li>
          <a use:active href="/notes/{directoryId}/{note._id}">
            <p class="note-title">{note.title}</p>
            <div class="note-description">
              <p>{timeSince(new Date(note.createdAt))}</p>
              <p class="relative">
                <button value={note._id} on:click={onNoteRemove}>Remove</button>
              </p>
            </div>
          </a>
        </li>
      {/each}
    {/if}
    {#if directoryId && notes && !notes.length}
      <li>
        <a href=" #" tinro-ignore>
          <p class="note-title">There's no notes yet.</p>
          <div class="note-description">
            <p>Creeate note using the form on the right.</p>
          </div>
        </a>
      </li>
    {/if}
    {#if !directoryId}
      <li>
        <a class="tip" href=" #">
          <p class="note-title">Create Directory</p>
          <div class="note-description">
            <p>Creeate directory using the form on the right.</p>
          </div>
        </a>
      </li>
      <li>
        <a href=" #">
          <p class="note-title">Choose directory to view notes</p>
          <div class="note-description">
            <p>You are step away of your notes.</p>
          </div>
        </a>
      </li>
    {/if}
  </ul>
</main>

<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { active, router } from "tinro";
  import request, {
    makeApiUrl,
    makeGetReq,
    makePostReq,
  } from "../../utils/request";
  import { timeSince } from "../../utils/date";
  import RemoveirectoryIcon from "../../components/icons/RemoveDirectoryIcon.svelte";
  import CreateDirectoryIcon from "../../components/icons/CreateDirectoryIcon.svelte";
  import CreateNoteIcon from "../../components/icons/CreateNoteIcon.svelte";
import UpdateDirectoryIcon from "../../components/icons/UpdateDirectoryIcon.svelte";
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
  const onDirectoryRemove = () => { 
    dispatch("directoryRemove", { directoryId });
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
    padding: 15px 5px 15px 0px;
  }
  .header select option {
    padding: 10px;
    font-size: 16px;
    color: black;
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
    padding: 10px;
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
    bottom: -5px;
    z-index: 2;
    padding: 5px;
    padding-right: 0;
  }
  .neutral-hover > *{
    color: var(--neutral);
    transition: color 0.3s ease;
  }
  .neutral-hover > *:hover{
    color: var(--text);
  }
  .header-control{ 
    position: static;
    padding: 0px;
  }
  button:hover {
    color: var(--text);
  }
  .relative {
    position: relative;
  }
</style>

<main>
  <div class="header">
    {#if directoryId}
    <span class="neutral-hover">
      <a href={"/notes"} title="Create Directory">
        <CreateDirectoryIcon/>
      </a>
      <a href={"/notes/"+directoryId+"/update"} title="Update Directory">
        <UpdateDirectoryIcon/>
      </a>
      <button on:click={onDirectoryRemove} class="header-control" title="Remove Directory">
        <RemoveirectoryIcon/>
      </button> 
    </span>
    {/if} 
    <select bind:value={directoryId} on:input={onDirectoryChange}>
      <option value="">Choose Directory</option>
      {#each directories as directory}
        <option value={directory._id}>{directory.name}</option>
      {/each}
    </select> 
    {#if directoryId}
      <div class="neutral-hover"> 
        <a href={'/notes/' + directoryId} title="Create Note">
          <CreateNoteIcon/>
        </a>
      </div>
    {/if}
    {#if !directoryId}
      <span/>
    {/if}
  </div>
  <ul class="note-list">
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

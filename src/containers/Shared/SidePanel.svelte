<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { active, router } from "tinro";
  import request, {
    makeApiUrl,
    makeGetReq,
    makePostReq,
  } from "../../utils/request";
  import { timeSince } from "../../utils/date";
  import { loadDirectoryNotes } from "../../actions/note";
  import RemoveirectoryIcon from "../../components/icons/RemoveDirectoryIcon.svelte";
  import CreateDirectoryIcon from "../../components/icons/CreateDirectoryIcon.svelte";
  import CreateNoteIcon from "../../components/icons/CreateNoteIcon.svelte";
  import UpdateDirectoryIcon from "../../components/icons/UpdateDirectoryIcon.svelte";
  import { note } from "../../actions";
  import { removeDirectory } from "../../actions/directory";
  import { removeNote } from "../../actions/note";
  import { isNotEmpty } from "../../utils/validators";

  let notes = [];
  export let params;
  export let directories = [];
  let { directoryId } = params;
  const dispatch = createEventDispatcher();

  $: if (directoryId) {
    loadNotes(directoryId);
  }

  const loadNotes = async (directoryId) => {
    const res = await loadDirectoryNotes({ directoryId });
    notes = res.payload;
  };

  export const updateNote = (payload) => {
    notes = notes.map((n) => (n._id === payload._id ? payload : n));
  };
  export const addNote = (payload) => {
    notes = [payload, ...notes];
  };
  const onNoteRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("eee ", e.target.value);
    if (window.confirm("Remove note?")) {
      const res = await removeNote({ noteId: e.target.value });
      notes = notes.filter((n) => n._id !== e.target.value);
      if (e.target.value === params.noteId) {
        router.goto("/notes/directories/" + directoryId);
      }
    }
  };
  const onDirectoryChange = (e) => {
    router.goto(
      "/notes/directories" + (e.target.value ? "/" + e.target.value : "")
    );
  };

  const handleRemove = async () => {
    if (window.confirm("Remove directory?")) {
      const res = await removeDirectory({ directoryId });
      dispatch("remove", res);
    }
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
    flex-direction: column;
    padding: 10px;
    justify-content: space-between;
  }

  .header select {
    border: none;
    background: transparent;
    color: var(--text);
    outline: none;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.03rem;
    padding: 15px 5px 15px 0px;
    width: 100%;
  }
  .header select option {
    padding: 10px;
    font-size: 14px;
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
    position: absolute;
    right: 0;
    bottom: -5px;
    z-index: 2;
    padding: 5px;
    padding-right: 0;
  }
  .neutral-hover > * {
    color: var(--neutral);
    transition: color 0.3s ease;
  }
  .neutral-hover > *:hover {
    color: var(--text);
  }
  .header-control {
    position: static;
    padding: 0px;
  }
  button:hover {
    color: var(--text);
  }
  .relative {
    position: relative;
  }
  .note-control {
    z-index: 9;
  }

  .header-controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    top: 3px;
  }
</style>

<main>
  <div class="header">
    <select bind:value={directoryId} on:input={onDirectoryChange}>
      <option value="">Choose Directory</option>
      {#each directories as directory}
        <option value={directory._id}>{directory.name}</option>
      {/each}
    </select>
    <div class="neutral-hover header-controls">
      {#if directoryId}
        <a href={'/notes/directories'} title="Create Directory">
          <CreateDirectoryIcon />
        </a>
        <a
          href="/notes/directories/update/{directoryId}"
          title="Update Directory">
          <UpdateDirectoryIcon />
        </a>
        <button
          on:click={handleRemove}
          class="header-control"
          title="Remove Directory">
          <RemoveirectoryIcon />
        </button>
      {/if}

      {#if directoryId}
        <a href={'/notes/directories/' + directoryId} title="Create Note">
          <CreateNoteIcon />
        </a>
      {/if}
    </div>
    {#if !directoryId}
      <span />
    {/if}
  </div>
  <ul class="note-list">
    {#if notes}
      {#each notes as note, i (note._id)}
        <li>
          <a
            use:active
            href="/notes/directories/{directoryId}/notes/{note._id}">
            <p class="note-title">{note.title}</p>
            <div class="note-description">
              <p>{timeSince(new Date(note.createdAt))}</p>
              <p class="relative">
                <button
                  class="note-control"
                  value={note._id}
                  on:click={onNoteRemove}>
                  Remove
                </button>
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

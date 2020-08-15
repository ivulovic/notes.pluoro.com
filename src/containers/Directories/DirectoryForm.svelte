<script>
  import { createEventDispatcher } from "svelte";
  import { createDirectory, updateDirectory } from "../../actions/directory";

  export let name = "";
  export let params = {};

  $: if (name) {
    directoryName = name;
  }

  let directoryName = "";

  const dispatch = createEventDispatcher();

  const handleCreate = async () => {
    const res = await createDirectory({ name: directoryName });
    dispatch("create", res);
  };
  const handleUpdate = async () => {
    const res = await updateDirectory({
      name: directoryName,
      directoryId: params.directoryId,
    });
    dispatch("update", res);
  };
</script>

<style>
  .note-title {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    color: var(--text);
    padding: 28px 20px;
    font-size: 1rem;
    box-sizing: border-box;
    padding-top: 25px 0px 15px 0px;
  }
  button {
    color: var(--text);
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
  }
  .controls button {
    padding: 5px 10px;
    border: 1px solid var(--edge);
    margin-top: 8px;
  }
  .controls {
    padding: 0px 15px;
  }
</style>

<div>
  <input
    class="note-title"
    bind:value={directoryName}
    placeholder={'Directory name...'} />
  <div class="controls">
    <button on:click={name ? handleUpdate : handleCreate}>
      {name ? 'Update' : 'Create'} Directory
    </button>
  </div>
</div>

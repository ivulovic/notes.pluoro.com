<script>
  import { loadNoteInfo, createNote, updateNote } from "../../actions/note";
  import Editor from "../../components/Editor.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const quillDefaultValue = { html: "", text: "" };
  let noteTitle = "";
  export let params = {};
  let noteDescription = quillDefaultValue;
  let intialEditorContent = quillDefaultValue;
  const handleTextChange = ({ detail }) => {
    noteDescription = detail;
  };
  $: if (params.noteId) {
    getNoteInfo(params);
  }
  const getNoteInfo = async ({ noteId }) => {
    const res = await loadNoteInfo({ noteId });
    if (res && res.payload) {
      noteTitle = res.payload.title;
      intialEditorContent.html = res.payload.description;
    }
  };
  const onSubmit = async () => {
    if (params.noteId) {
      const res = await updateNote({
        title: noteTitle,
        description: noteDescription.html,
        directory: params.directoryId,
        noteId: params.noteId,
      });
      dispatch("update", res);
    } else {
      const res = await createNote({
        title: noteTitle,
        description: noteDescription.html,
        directory: params.directoryId,
        noteId: params.noteId,
      });
      dispatch("create", res);
    }
  };
</script>

<style>
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
  .controls button:hover {
    background-color: var(--edge);
  }
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
  .controls {
    padding: 0px 15px;
  }
</style>

<div>
  <input
    bind:value={noteTitle}
    class="note-title"
    placeholder="Note title..." />
  <Editor on:text-change={handleTextChange} {intialEditorContent} />
  <div class="controls">
    <button on:click={onSubmit}>
      {params.noteId ? 'Update' : 'Create'} Note
    </button>
  </div>
</div>

<script>
  import Editor from "../../components/Editor.svelte";
  import { onMount } from "svelte";
  import { router, Route } from "tinro";

  import request, {
    makeApiUrl,
    makeGetReq,
    makePostReq,
makePatchReq,
makeDeleteReq,
  } from "../../utils/request";
  import { each, afterUpdate } from "svelte/internal";
  import NoteList from "./NoteList.svelte";

  export let params = {};
  const quillDefaultValue = { html: "", text: "" };

  $: if (params.noteId) { //watch the params.id for changes
    loadNoteInfo({ detail: params });
  }

  let noteTitle = "";
  let noteDescription = quillDefaultValue;
  let intialEditorContent = quillDefaultValue;

  let directories = [];
  let directoryName = "";


  let currentDirectory = directories.find((x) => x._id === params.directoryId);

  let notes = [];


  onMount(async () => {
    const response = await request(
      makeApiUrl("/notes/directories"),
      makeGetReq()
    );
    directories = response;
    if (params.directoryId) {
      loadNotes({ detail: params });
    }
    if (params.noteId) {
      loadNoteInfo({ detail: params });
    }
  });
  const loadNotes = async ({ detail: { directoryId, noteId } }) => {
    if (directoryId) {
      try{
        const response = await request(
          makeApiUrl("/notes/notes/" + directoryId),
          makeGetReq()
        );
        notes = response;
        router.goto("/notes" + (directoryId ? "/" + directoryId : "") + (noteId ? "/" + noteId : ""));
      } catch(error){
        router.goto("/notes" + (directoryId ? "/" + directoryId : ""));
      }
    } else {
      router.goto("/notes");
    }
  };
  const loadNoteInfo = async ({ detail: { directoryId, noteId } }) => {
    if (directoryId && noteId!=="update") {
      const response = await request(
        makeApiUrl("/notes/notes/" + noteId+"/info"),
        makeGetReq()
      );
      noteTitle = response.title;
      intialEditorContent.html = response.description;
    }
  };
  const handleTextChange = ({ detail }) => {
    noteDescription = detail;
  };
  const onCreateDirectory = async () => {
    if (directoryName && directoryName.trim()) {
      const response = await request(
        makeApiUrl("/notes/directories"),
        makePostReq({ name: directoryName.trim() })
      );
      directories = [response, ...directories];
      router.goto("/notes/"+response._id);
    }
  };
  const handleAction = async () => {
    if(params.noteId){
      await onUpdateNote();
    } else {
      await onCreateNote();
    }
  }
  const onCreateNote = async () => {
    const {directoryId} = params;
    if(noteTitle && noteTitle.trim()){
      if(noteDescription.text){
        try{
          const response = await request(
          makeApiUrl("/notes/notes"),
          makePostReq({directory: directoryId, title: noteTitle.trim(), description: noteDescription.html })
        );
        notes = [response, ...notes];
        router.goto("/notes/"+directoryId+"/"+response._id);
      } catch(e){
        }
      }
    }
  }
  const onUpdateNote = async () => {
    const {directoryId, noteId} = params;
    if(!noteId) return;
    if(noteTitle && noteTitle.trim()){
      if(noteDescription.text){
        try{
          const response = await request(
          makeApiUrl("/notes/notes/"+noteId),
          makePatchReq({directory: directoryId, title: noteTitle.trim(), description: noteDescription.html })
        );
        notes = notes.map(x => x._id === response._id ? response : x);
      } catch(e){
        }
      }
    }
  }

  const onUpdateDirectory = async () => {
    const {directoryId} = params;
    if(directoryName && directoryName.trim()){
      try{
        const response = await request(
        makeApiUrl("/notes/directories/"+directoryId),
        makePatchReq({name: directoryName })
      );
      directories = directories.map(x => x._id === response._id ? response : x);
    } catch(e){
    }
    }
  }
  const onRemoveNote = async({detail:{noteId}}) => {
    if(!noteId) return;
    try{
      const response = await request(
        makeApiUrl("/notes/notes/"+noteId),
        makeDeleteReq()
      );
      notes = notes.filter(x => x._id !== response._id);
      if(response._id === params.noteId){
        router.goto("/notes/"+response.directory._id);
      }
    } catch(e){
    }
  }
  const onRemoveDirectory = async({detail:{directoryId}}) => {
    try{
      const response = await request(
        makeApiUrl("/notes/directories/"+directoryId),
        makeDeleteReq()
      );
      directories = directories.filter(x => x._id !== response._id);
      router.goto("/notes");
    } catch(e){
    }
  }
</script>

<style>
  main {
    display: grid;
    margin-left: 70px;
    position: relative;
    grid-template-columns: 25% 75%;
    padding: 0px 0px 0px 0px;
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

<main> 
  
  <NoteList {params} on:directoryRemove={onRemoveDirectory} on:noteRemove={onRemoveNote} on:directoryChange={loadNotes} directories={directories} {notes} />
  
  {#if params.directoryId}
    {#if params.noteId==="update"}
      <div>
        <input
          class="note-title"
          bind:value={directoryName}
          placeholder="New directory name..." />
          <div class="controls">
            <button
              on:click={onUpdateDirectory}>
              Update Directory
            </button>
          </div>
      </div>
    {:else}
      <div>
        <input
          bind:value={noteTitle}
          class="note-title"
          placeholder="Note title..." />
        <Editor on:text-change={handleTextChange} {intialEditorContent} />
        <div class="controls">
          <button
            on:click={handleAction}>
            Save changes
          </button>
        </div>
      </div>
    {/if}
  {:else}
  <div>
    <input
      class="note-title"
      bind:value={directoryName}
      placeholder="Directory name..." />
      <div class="controls">
        <button
          on:click={onCreateDirectory}>
          Create Directory
        </button>
      </div>
  </div>
  {/if}
</main>

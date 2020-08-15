<script>
  import DirectoryForm from "./DirectoryForm.svelte";
  import SidePanel from "../Shared/SidePanel.svelte";

  let currentDirectory = {};

  $: if (directories && directories.length && params.directoryId) {
    // it's UPDATE mode
    currentDirectory = directories.find((x) => x._id === params.directoryId);
  }
  export let params = {};
  export let directories = [];
</script>

<style>

</style>

<main>
  <DirectoryForm on:create on:update name={currentDirectory.name} {params} />
</main>

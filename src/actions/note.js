import request, {
  makeApiUrl,
  makeGetReq,
  makePostReq,
  makePatchReq,
  makeDeleteReq,
} from "../utils/request";
import { isNotEmpty } from "../utils/validators";

const wrapResponse = (payload) => {
  return {
    type: 'note',
    payload,
  }
}

export const createNote = async (payload) => {
  if (isNotEmpty(payload.title) && isNotEmpty(payload.description)) {
    const response = await request(
      makeApiUrl("/notes/notes"),
      makePostReq({ title: payload.title.trim(), description: payload.description, directory: payload.directory })
    );
    return wrapResponse(response);
  }
}

export const updateNote = async (payload) => {
  if (isNotEmpty(payload.title) && isNotEmpty(payload.description)) {
    const response = await request(
      makeApiUrl("/notes/notes/" + payload.noteId),
      makePatchReq({
        title: payload.title.trim(),
        description: payload.description,
        directory: payload.directory
      })
    );
    return wrapResponse(response);
  }
}

export const removeNote = async (payload) => {
  const response = await request(
    makeApiUrl("/notes/notes/" + payload.noteId),
    makeDeleteReq(),
  );
  return wrapResponse(response);
}

export const loadDirectoryNotes = async (payload) => {
  const response = await request(
    makeApiUrl("/notes/notes/" + payload.directoryId),
    makeGetReq()
  );
  return wrapResponse(response);
}

export const loadNoteInfo = async (payload) => {
  const response = await request(
    makeApiUrl("/notes/notes/" + payload.noteId + "/info"),
    makeGetReq()
  );
  return wrapResponse(response);
}
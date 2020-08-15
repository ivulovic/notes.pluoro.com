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
    type: 'directory',
    payload,
  }
}

export const createDirectory = async (payload) => {
  if (isNotEmpty(payload.name)) {
    const response = await request(
      makeApiUrl("/notes/directories"),
      makePostReq({ name: payload.name.trim() })
    );
    return wrapResponse(response);
  }
}

export const updateDirectory = async (payload) => {
  console.log(payload)
  if (isNotEmpty(payload.name)) {
    const response = await request(
      makeApiUrl("/notes/directories/" + payload.directoryId),
      makePatchReq({ name: payload.name.trim() })
    );
    return wrapResponse(response);
  }
}

export const removeDirectory = async (payload) => {
  const response = await request(
    makeApiUrl("/notes/directories/" + payload.directoryId),
    makeDeleteReq(),
  );
  return wrapResponse(response);
}

export const loadDirectories = async () => {
  const response = await request(
    makeApiUrl("/notes/directories"),
    makeGetReq()
  );
  return wrapResponse(response);
}


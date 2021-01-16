function parseRequest(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const paramsObj = {};
    for (const key of url.searchParams.keys()) {
      paramsObj[key] = url.searchParams.get(key);
    }
    const { id, fmt, ...props } = paramsObj;
    //  Return parsed request
    return [{ id, props, fmt: fmt || "png" }, null];
  } catch (e) {
    console.error(e);
    return [null, "ERROR"];
  }
}

module.exports = parseRequest;

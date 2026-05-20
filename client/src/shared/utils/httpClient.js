//mini-axios artesanal. 
export const helpHttp = () => {
  const customFetch = async (endpoint, options) => {
    const defaultHeader = {
      accept: "application/json",
    };

    const controller = new AbortController()
    options.signal = controller.signal

    options.method = options.method || "GET"

    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader;

    options.body = JSON.stringify(options.body) || false

    if (!options.body) delete options.body

    setTimeout(() => {
      controller.abort()
    }, 3000);

    return fetch(endpoint, options)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject({
            err: true,
            status: res.status || "00",
            statusText: res.statusText || "Ocurrió un error",
          })
      )
  };
  const get = async (url, options = {}) => customFetch(url, options)
  const post = async (url, options = {}) => {
    options.method = "POST";
    return customFetch(url, options);
  };
  const put = async (url, options = {}) => {
    options.method = "PUT";
    return customFetch(url, options);
  };
  const patch = async (url, options = {}) => {
    options.method = "PATCH";
    return customFetch(url, options);
  };
  const del = async (url, options = {}) => {
    options.method = "DELETE";
    return customFetch(url, options)
  };

  return {
    get,
    post,
    put,
    patch,
    del,
  };
};

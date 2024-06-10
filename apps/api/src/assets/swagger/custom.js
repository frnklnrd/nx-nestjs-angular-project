(function () {
  const originalFetch = window.fetch;

  window.fetch = function (input, init) {
    const method = (init && init.method) || 'GET';
    const url = input instanceof Request ? input.url : input;

    console.debug('Intercepting fetch:', method, url);

    if (init && init.body) {
      console.debug('Request:', init.body);
    }

    return originalFetch
      .apply(this, arguments)
      .then((response) => {
        const clonedResponse = response.clone();

        clonedResponse.json().then((data) => {
          console.debug('Response:', data);
        });

        return response;
      })
      .catch((error) => {
        console.error('Error in fetch', error);
        throw error;
      });
  };
})();

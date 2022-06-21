function setToLocalStorage(key: any, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function getFromLocalStorage(key: any) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return null
    }
  }
  function removeFromLocalStorage(key: any) {
    localStorage.removeItem(key);
  }
  
  function Store() {
    let store = getFromLocalStorage("store") || {};
    let subscriptions: any = {};
  
    function get(name: any) {
      return store[name];
    }
  
    function set(name: any, value: any) {
      store = { ...store, [name]: value };
      setToLocalStorage("store", store);
      if (subscriptions[name] && subscriptions[name].length) {
        subscriptions[name]
          .filter((callback: any) => callback !== null)
          .forEach((callback: any) => {
            callback(value);
          });
      }
    }
  
    function subscribe(name: any, callback: any) {
      if (!subscriptions[name]) {
        subscriptions[name] = [];
      }
  
      const existing = subscriptions[name].find((cb: any) => cb === callback);
      if (existing) {
        return () => {};
      }
  
      const length = subscriptions[name].push(callback);
      const index = length - 1;
  
      return () => {
        subscriptions[name][index] = null;
      };
    }
  
    function reset() {
      store = {};
      subscriptions = {};
      removeFromLocalStorage("store");
    }
  
    return { get, set, subscribe, reset };
  }
  
  let storeInstance: any = {};
  if (typeof window !== "undefined") {
    storeInstance = Store();
  }
  
  const { get, set, subscribe, reset } = storeInstance;
  
  export { get, set, subscribe, reset };
  
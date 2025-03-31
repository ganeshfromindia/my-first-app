import { useState, useCallback, useRef, useEffect } from "react";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>([]);

  const activeHttpRequests = useRef<any>([]);

  const sendRequest = useCallback<any>(
    async (url: any, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
          // withCredentials: true,
          // credentials: "include",
        });
        let responseData;
        if (url.includes("download")) {
          responseData = response.blob();
        } else {
          responseData = await response.json();
        }

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl: any) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw responseData.message;
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl: any) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

export default useHttpClient;

import axios, { AxiosInstance, AxiosError } from "axios";
import { AppError } from "@utils/AppError";
import { getAuthTokenStorage } from "@storage/authStorage";
import { createAuthTokenStorage } from "@storage/authStorage";

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};
type SignOut = () => void;
type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};
let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;
const api = axios.create({
  baseURL: "http://10.0.0.104:3333",
}) as APIInstanceProps;
api.registerInterceptTokenManager = (signOut) => {
  // intercepta todas as respostas do back end e captura os erros do servidor
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      // verifica se o token é válido
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refresh_token } = await getAuthTokenStorage();
          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }
          const requestOriginalConfig = requestError.config;
          if (isRefreshing) {
            // adiciona as requisições na fila enquanto atualiza o token
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  requestOriginalConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(requestOriginalConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }
          isRefreshing = true;
          return new Promise(async (resolve, reject) => {
            try {
              // obtem o novo token
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });
              await createAuthTokenStorage({
                token: data.token,
                refresh_token: data.refresh_token,
              });
              // atualiza o cabeçário da requisoção atual e futuras
              requestOriginalConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;
              //todas as requisições na fila serão processadas
              failedQueue.forEach((request) => {
                request.onSuccess(data.token);
              });
              console.log("TOKEN ATUALIZADO");
              resolve(api(requestOriginalConfig));
            } catch (error: any) {
              // se a obtenção do token falhar todas as requisições irão falhar
              // e o usuário se será deslogado
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });
              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }
        signOut();
      }
      // verifica se houve código de erro enviado pelo servidor
      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(new AppError(requestError));
      }
    }
  );
  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };

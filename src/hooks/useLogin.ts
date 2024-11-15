import { useMutation } from "@tanstack/react-query";
import { LoginResponse, Payload } from "../types/login";
import axios from "axios";

export const postLogin = async (payload: Payload) => {
  const data = await axios
    .post(`${import.meta.env.VITE_REACT_API_URL}auth/login`, payload)
    .then(({ data }) => data);
  return data;
};

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (
    data: LoginResponse,
    variables: Payload,
    context: unknown
  ) => void;
  onError: (error: Error, variables: Payload, context: unknown) => void;
}) =>
  useMutation<LoginResponse, Error, Payload>({
    mutationFn: (payload: Payload) => postLogin(payload),
    onSuccess,
    onError,
  });

import { Message } from "@/model/Message";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};






export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
};



export function ApiSuccess(message: string, data: any = {}, status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function ApiError(message: string, status = 400) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}
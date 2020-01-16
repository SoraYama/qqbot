import { APITimeoutError, CQRequestOptions } from "cq-websocket";

interface CQHTTPMessage {
  type: string;
  data: Record<string, string> | null;
}

declare class CQEvent {
  readonly messageFormat: "string" | "array";
  stopPropagation(): void;
  getMessage(): string | ArrayMessage;
  setMessage(msg: string | ArrayMessage): void;
  appendMessage(msg: string | CQTag | CQHTTPMessage): void;
  hasMessage(): boolean;
  onResponse(
    handler: (res: object) => void,
    options: number | CQRequestOptions
  ): void;
  onError(handler: (err: APITimeoutError) => void): void;
}

type Serializable = string | number | boolean;

declare class CQTag {
  readonly tagName: string;
  readonly data: Readonly<Record<string, Serializable>>;
  modifier: Record<string, Serializable>;

  equals(another: CQTag): boolean;
  coerce(): this;
  toJSON(): CQHTTPMessage;
  valueOf(): string;
  toString(): string;
}

export type ListenerReturn = void | Promise<void>;
export type ArrayMessage = (CQTag | CQHTTPMessage | string)[];
export type MessageListenerReturn =
  | ListenerReturn
  | string
  | Promise<string>
  | ArrayMessage
  | Promise<ArrayMessage>;
export type MessageEventListener = (
  event: CQEvent,
  context: Record<string, any>,
  tags: CQTag[]
) => MessageListenerReturn;

import { Message } from "@/types";
import { FC } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({
  messages,
  loading,
  onSend,
  onReset
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col">

      <div className="mb-4 flex flex-shrink-0 flex-row items-center justify-between px-2 pt-2 sm:px-4 sm:pt-4">
        <ResetChat onReset={onReset} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border-neutral-300 sm:border">

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 sm:px-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="my-1 sm:my-1.5"
            >
              <ChatMessage message={message} />
            </div>
          ))}

          {loading && (
            <div className="my-1 sm:my-1.5">
              <ChatLoader />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-neutral-200 bg-white p-2 sm:p-4">
          <ChatInput onSend={onSend} />
        </div>

      </div>
    </div>
  );
};

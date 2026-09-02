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

      {/* Top controls */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3">
        <ResetChat onReset={onReset} />
      </div>

      {/* Scrollable conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="my-1.5"
          >
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1.5">
            <ChatLoader />
          </div>
        )}
      </div>

      {/* Input remains visible */}
      <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-4 py-3">
        <ChatInput onSend={onSend} />
      </div>

    </div>
  );
};

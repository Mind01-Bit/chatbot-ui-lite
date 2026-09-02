import { Message } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import {
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";

interface Props {
  onSend: (message: Message) => void;
}

export const ChatInput: FC<Props> = ({ onSend }) => {
  const [content, setContent] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    onSend({
      role: "user",
      content: trimmedContent
    });

    setContent("");
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "44px";

    const newHeight = Math.min(
      textarea.scrollHeight,
      160
    );

    textarea.style.height = `${newHeight}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > 160 ? "auto" : "hidden";
  }, [content]);

  return (
    <div className="relative w-full">

      <textarea
        ref={textareaRef}
        className="min-h-[44px] max-h-[160px] w-full rounded-lg border-2 border-neutral-200 py-2 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-neutral-300"
        style={{
          resize: "none"
        }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        onClick={handleSend}
        aria-label="Send message"
        className="absolute bottom-2 right-2"
      >
        <IconArrowUp className="h-8 w-8 rounded-full bg-blue-500 p-1 text-white hover:opacity-80" />
      </button>

    </div>
  );
};

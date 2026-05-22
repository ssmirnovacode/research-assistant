import { ChatArea } from "@/components/chat/ChatArea";
import { INITIAL_MESSAGES } from "@/lib/constants";

export default function Home() {
  return <ChatArea initialMessages={INITIAL_MESSAGES} />;
}

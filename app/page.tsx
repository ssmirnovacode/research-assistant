import { ChatArea } from '@/components/chat/ChatArea'
import { INITIAL_MESSAGES, INITIAL_NOTES } from '@/lib/mock-data'

export default function Home() {
  return <ChatArea initialMessages={INITIAL_MESSAGES} initialNotes={INITIAL_NOTES} />
}

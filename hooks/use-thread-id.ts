import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useThreadId() {
  const [threadId] = useState(() => uuidv4());
  return threadId;
}

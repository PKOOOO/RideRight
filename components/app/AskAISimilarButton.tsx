"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatActions } from "@/lib/store/chat-store-provider";

interface AskAISimilarButtonProps {
  productName: string;
}

export function AskAISimilarButton({ productName }: AskAISimilarButtonProps) {
  const { openChatWithMessage } = useChatActions();

  const handleClick = () => {
    openChatWithMessage(`Show me products similar to "${productName}"`);
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
    >
      <Sparkles className="h-4 w-4" />
      Ask AI for similar Cars
    </Button>
  );
}

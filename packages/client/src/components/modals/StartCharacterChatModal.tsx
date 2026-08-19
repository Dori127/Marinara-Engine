import { useStartChatFromCharacter } from "../../hooks/use-start-chat-from-character";
import { useUIStore } from "../../stores/ui.store";
import { useChatStore } from "../../stores/chat.store";
import { useDeleteChat } from "../../hooks/use-chats";
import { ChatModeSelectorModal, type ChatLaunchMode } from "../chat/ChatModeSelectorModal";

interface StartCharacterChatModalProps {
  open: boolean;
  onClose: () => void;
  characterId: string;
  characterName: string;
  onDeleteChatId?: string;
}

export function StartCharacterChatModal({
  open,
  onClose,
  characterId,
  characterName,
  onDeleteChatId,
}: StartCharacterChatModalProps) {
  const closeAllDetails = useUIStore((state) => state.closeAllDetails);
  const closeRightPanel = useUIStore((state) => state.closeRightPanel);
  const { startChatFromCharacter, isStartingChat } = useStartChatFromCharacter();
  const deleteChat = useDeleteChat();
  const setActiveChatId = useChatStore((s) => s.setActiveChatId);

  const handleClose = () => {
    if (onDeleteChatId) {
      deleteChat.mutate({ id: onDeleteChatId, force: true });
      setActiveChatId(null);
    }
    onClose();
  };

  const selectMode = (mode: ChatLaunchMode) => {
    startChatFromCharacter({
      characterId,
      characterName,
      mode,
      shortcutMode: false,
      onSuccess: () => {
        if (onDeleteChatId) {
          deleteChat.mutate({ id: onDeleteChatId, force: true });
        }
        closeAllDetails();
        if (typeof window !== "undefined" && window.innerWidth < 768) closeRightPanel();
        onClose();
      },
    });
  };

  return (
    <ChatModeSelectorModal open={open} onClose={handleClose} onSelectMode={selectMode} isPending={isStartingChat} />
  );
}

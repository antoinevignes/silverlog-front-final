import { useState, useMemo } from "react";
import { ArrowLeft, Search, Send, Check, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { User } from "lucide-react";
import { useAuth } from "@/auth";
import { userFollowersQuery } from "@/features/user/api/user.queries";
import { useSendRecommendation } from "@/features/notification/api/notification.mutations";
import Button from "@/components/ui/button/button";
import type { MovieType } from "@/features/movie/types/movie";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import "./recommend-dialog.scss";
import Title from "@/components/ui/title/title";

interface RecommendDialogProps {
  movie: MovieType;
  movieYear: number;
  onBack: () => void;
  onClose: () => void;
}

export function RecommendDialog({
  movie,
  movieYear,
  onBack,
  onClose,
}: RecommendDialogProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sentUserIds, setSentUserIds] = useState<Set<string>>(new Set());
  const [sendingUserId, setSendingUserId] = useState<string | null>(null);

  const { data: followers, isLoading } = useQuery({
    ...userFollowersQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  const { mutate: sendRecommendation } = useSendRecommendation();

  const filteredFollowers = useMemo(() => {
    if (!followers) return [];

    let result = [...followers];

    if (searchQuery.trim()) {
      result = result.filter((follower) =>
        follower.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (!searchQuery.trim()) {
      result = result.slice(0, 10);
    }

    return result;
  }, [followers, searchQuery]);

  const handleSend = (recipientId: string) => {
    setSendingUserId(recipientId);

    sendRecommendation(
      { recipientId, movieId: movie.id },
      {
        onSuccess: () => {
          setSentUserIds((prev) => new Set(prev).add(recipientId));
          setSendingUserId(null);
          onClose();
        },
        onError: () => {
          setSendingUserId(null);
        },
      },
    );
  };

  return (
    <div className="recommend-dialog">
      <header className="recommend-dialog__header">
        <Button
          className="recommend-dialog__back-btn"
          onClick={onBack}
          aria-label="Retour"
          variant="ghost"
          size="icon"
        >
          <ArrowLeft size={20} />
        </Button>

        <div className="recommend-dialog__title">
          <Title title="Recommander à un ami" size="sm" />

          <p className="recommend-dialog__subtitle">
            {movie.title} ({!Number.isNaN(movieYear) ? movieYear : "NC"})
          </p>
        </div>
      </header>

      <div className="recommend-dialog__search">
        <Search size={16} className="recommend-dialog__search-icon" />
        <input
          type="text"
          placeholder="Rechercher parmi vos followers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="recommend-dialog__search-input"
        />
      </div>

      <div className="recommend-dialog__list">
        {isLoading ? (
          <div className="recommend-dialog__loading">
            <Loader2 size={24} className="animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : !followers || followers.length === 0 ? (
          <div className="recommend-dialog__empty">
            <p>Vous n'avez aucun follower pour le moment.</p>
          </div>
        ) : filteredFollowers.length === 0 ? (
          <div className="recommend-dialog__empty">
            <p>Aucun follower ne correspond à "{searchQuery}"</p>
          </div>
        ) : (
          filteredFollowers.map((follower) => {
            const isSent = sentUserIds.has(follower.id.toString());
            const isSending = sendingUserId === follower.id.toString();

            return (
              <div
                key={follower.id}
                className={`recommend-dialog__item ${
                  isSent ? "recommend-dialog__item--sent" : ""
                }`}
              >
                <div className="recommend-dialog__user">
                  {follower.avatar_path ? (
                    <Image
                      src={getCloudinarySrc(follower.avatar_path, "avatars")}
                      layout="constrained"
                      width={32}
                      height={32}
                      alt={`Avatar de ${follower.username}`}
                      background="auto"
                      className="recommend-dialog__avatar"
                    />
                  ) : (
                    <div className="recommend-dialog__avatar-placeholder">
                      <User size={16} />
                    </div>
                  )}
                  <span className="recommend-dialog__username">
                    {follower.username}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isSent ? "ghost" : "outline"}
                  onClick={() => handleSend(follower.id.toString())}
                  disabled={isSent || isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Envoi...
                    </>
                  ) : isSent ? (
                    <>
                      <Check size={14} />
                      Envoyé
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecommendDialog;

import { Dialog, DialogContent } from "@/components/ui/dialog/dialog";
import { useQuery } from "@tanstack/react-query";
import {
  userFollowersQuery,
  userFollowingQuery,
} from "@/features/user/api/user.queries";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/avatar/avatar";
import { X } from "lucide-react";
import "./follow-modal.scss";

type FollowModalProps = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
  title: string;
};

export default function FollowModal({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: FollowModalProps) {
  const followersQuery = useQuery({
    ...userFollowersQuery(userId),
    enabled: type === "followers",
  });
  const followingQuery = useQuery({
    ...userFollowingQuery(userId),
    enabled: type === "following",
  });
  const { data: users, isLoading } =
    type === "followers" ? followersQuery : followingQuery;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <section className="follow-modal-header">
          <h2 className="follow-modal-title">{title}</h2>
          <button
            className="follow-modal-close"
            onClick={() => onClose(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </section>

        <section className="follow-modal-body">
          {isLoading ? (
            <div className="follow-modal-loading">
              <Skeleton className="follow-user-skeleton" />
              <Skeleton className="follow-user-skeleton" />
              <Skeleton className="follow-user-skeleton" />
            </div>
          ) : !users || users.length === 0 ? (
            <p className="follow-modal-empty text-secondary">
              {type === "followers"
                ? "Aucun abonné pour le moment."
                : "Cet utilisateur ne suit personne pour le moment."}
            </p>
          ) : (
            <ul className="follow-user-list">
              {users.map((u: any) => (
                <li key={u.id} className="follow-user-item">
                  <Link
                    to="/user/$userId"
                    params={{ userId: u.id.toString() }}
                    className="follow-user-link"
                    onClick={() => onClose(false)}
                  >
                    <Avatar
                      username={u.username}
                      src={u.avatar_path}
                      size="md"
                    />
                    <span className="follow-user-name">{u.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}

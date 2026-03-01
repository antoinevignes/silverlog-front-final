import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import ListCard from "../../lists/list-card/list-card";
import type { ListType } from "@/utils/types/list";
import { useAuth } from "@/auth";
import Button from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { useDeleteList } from "@/queries/list.mutations";
import { personalListsQuery } from "@/queries/list.queries";
import "./lists.scss";

export default function Lists() {
  const routeApi = getRouteApi("/user/$userId/");
  const { userId } = routeApi.useParams();
  const { user } = useAuth();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const isPublic = Number(user?.id) !== Number(userId);
  const { data: lists } = useSuspenseQuery(
    personalListsQuery(userId, isPublic),
  );

  const { mutate: deleteList, isPending } = useDeleteList();

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteList(deleteTargetId, {
        onSuccess: () => setDeleteTargetId(null),
      });
    }
  };

  return (
    <section className="content-section" aria-label="Listes publiques">
      <div className="lists-grid">
        {lists.map((list: ListType) => (
          <div key={list.id} className="list-wrapper">
            <ListCard list={list} />
            {!isPublic && (
              <Button
                variant="destructive"
                size="icon"
                className="delete-list-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteTargetId(list.id);
                }}
                aria-label={`Supprimer la liste ${list.title}`}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent>
          <div className="delete-header">
            <h2 className="delete-title">Supprimer la liste</h2>
            <p className="delete-description">
              Êtes-vous sûr de vouloir supprimer définitivement cette liste ?
              Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

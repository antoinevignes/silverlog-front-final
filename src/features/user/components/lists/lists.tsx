import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Trash2, ListPlus } from "lucide-react";
import { useState } from "react";

import ListCard from "@/features/list/components/list-card/list-card";
import CreateList from "@/features/list/components/dialogs/create-list/create-list";
import type { ListType } from "@/features/list/types/list";
import { useAuth } from "@/auth";
import Button from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { useDeleteList } from "@/features/list/api/list.mutations";
import { personalListsQuery } from "@/features/list/api/list.queries";
import "./lists.scss";

export default function Lists({ userId }: { userId: string }) {
  const { user } = useAuth();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
      {!isPublic && lists.length > 0 && (
        <header className="lists-header">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={16} />
            Créer une liste
          </Button>
        </header>
      )}

      {lists.length === 0 ? (
        <div className="lists-empty-state">
          <ListPlus size={48} />
          <p className="text-secondary">
            Vous n'avez pas encore créé de liste.
          </p>
          {!isPublic && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} />
              Créer une liste
            </Button>
          )}
        </div>
      ) : (
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
      )}

      {/* MODALE DE CRÉATION */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <CreateList onBack={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* MODALE DE SUPPRESSION */}
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

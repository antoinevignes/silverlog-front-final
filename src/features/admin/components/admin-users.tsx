import { useQuery } from "@tanstack/react-query";
import { adminUsersQuery } from "@/features/admin/api/admin.queries";
import {
  useUpdateUserRole,
  useDeleteUser,
} from "@/features/admin/api/admin.mutations";
import Title from "@/components/ui/title/title";
import Button from "@/components/ui/button/button";
import { Trash2, Shield, User } from "lucide-react";
import { useAuth } from "@/auth";

export default function AdminUsers() {
  const { data: users, isLoading, error } = useQuery(adminUsersQuery());
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { user: currentUser } = useAuth();

  if (isLoading)
    return <p className="loading-message">Chargement des membres...</p>;
  if (error)
    return <p className="error-message">Erreur: {(error as any).message}</p>;

  return (
    <section className="admin-users">
      <Title title="Gestion des Utilisateurs" variant="h2" />

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const isCurrentUser = Number(u.id) === Number(currentUser?.id);

              return (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`status-badge ${u.verified ? "status-badge--verified" : "status-badge--unverified"}`}
                    >
                      {u.verified ? "Vérifié" : "Non Vérifié"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`role-badge ${u.role === "admin" ? "role-badge--admin" : "role-badge--user"}`}
                    >
                      {u.role === "admin" ? (
                        <Shield size={14} />
                      ) : (
                        <User size={14} />
                      )}
                      {u.role === "admin" ? "Admin" : "Membre"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateRole({
                            userId: u.id,
                            role: u.role === "admin" ? "user" : "admin",
                          })
                        }
                        disabled={isUpdating || isDeleting || isCurrentUser}
                      >
                        {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (
                            confirm(
                              `Voulez-vous vraiment supprimer ${u.username} et toutes ses données ?`,
                            )
                          ) {
                            deleteUser(u.id);
                          }
                        }}
                        disabled={isUpdating || isDeleting || isCurrentUser}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users?.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  Aucun membre trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { adminUsersQuery } from "@/features/admin/api/admin.queries";
import { useUpdateUserRole, useDeleteUser } from "@/features/admin/api/admin.mutations";
import Title from "@/components/ui/title/title";
import Button from "@/components/ui/button/button";
import { Trash2, Shield, User } from "lucide-react";

export default function AdminUsers() {
  const { data: users, isLoading, error } = useQuery(adminUsersQuery());
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  if (isLoading) return <p className="text-secondary py-lg">Chargement des membres...</p>;
  if (error) return <p className="text-destructive py-lg">Erreur: {(error as any).message}</p>;

  return (
    <div className="admin-users-tab">
      <Title title="Gestion des Utilisateurs" variant="h2" className="mb-md" />

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
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td className="font-semibold">{u.username}</td>
                <td className="text-secondary text-sm">{u.email}</td>
                <td>
                  <span className={`status-badge ${u.verified ? 'verified' : 'unverified'}`}>
                    {u.verified ? "Vérifié" : "Non Vérifié"}
                  </span>
                </td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role === "admin" ? <Shield size={14} /> : <User size={14} />}
                    {u.role === "admin" ? "Admin" : "Membre"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRole({ userId: u.id, role: u.role === "admin" ? "user" : "admin" })}
                      disabled={isUpdating || isDeleting}
                    >
                      {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
                    </Button>
                    <button
                      className="delete-icon-btn"
                      onClick={() => {
                        if (confirm(`Voulez-vous vraiment bannir/supprimer ${u.username} et toutes ses données ?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      title="Supprimer l'utilisateur"
                      disabled={isUpdating || isDeleting}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-md text-secondary">
                  Aucun membre trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Admin users identified by their GitHub username
const ADMIN_USERNAMES = ["yashab-cyber"];

export function isAdmin(username: string | null | undefined): boolean {
  if (!username) return false;
  return ADMIN_USERNAMES.includes(username.toLowerCase());
}

export function getAdminUsername(user: any): string | null {
  return user?.user_metadata?.user_name || null;
}

import { ADMIN } from '../config/role';
import { useStore } from '../state/storeHooks';
import { User } from '../types/user';

function useRole() {
  const { user } = useStore(({ app }) => app);

  const isAdmin = () => {
    if (!user) {
      return false;
    }

    const userRoleIsNone = user && user.map((x: User) => x.roles).isNone();

    if (userRoleIsNone) {
      return false;
    }

    const userRole = user && user.map((x: User) => x.roles).unwrap();
    const rs = userRole.includes(ADMIN);

    return rs;
  };

  return { user, isAdmin };
}

export default useRole;

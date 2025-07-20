//type
import type { User, UserManager, UserProfile } from "oidc-client-ts";
import type { ComputedRef } from "vue";
import type { MaybeNull, VueOidcSettings } from "vue3-oidc";

interface OidcState<T = UserProfile> {
  oidcSettings: MaybeNull<VueOidcSettings>;
  userManager: MaybeNull<UserManager>;
  refreshUserManager: MaybeNull<UserManager>;
  user: MaybeNull<OidcUser<T>>;
  token: ComputedRef<string | null>;
  hasExpiresAt: ComputedRef<boolean>;
  redirect_uri: string;
}

interface OidcActions {
  setUser(user: User): void;
  removeUser(): void;
}

type OidcUser<T = UserProfile> = User & {
  profile: UseUserProfile<T>;
};

type UseUserProfile<T = UserProfile> = T;
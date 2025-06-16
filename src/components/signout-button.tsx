import { signin } from "../actions/signin";
import { signOutAction } from "../actions/signout";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  )
}
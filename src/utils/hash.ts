import bcryptjs from "bcryptjs";

export default async function hash(password: string) {
  const hashPassword = bcryptjs.hashSync(password);
  return hashPassword;
}

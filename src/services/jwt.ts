import jwt from "jsonwebtoken";

async function createJwtToken(id: string) {
  const token = await jwt.sign({ id }, process.env.SECRET as string, { expiresIn: "2d" });
  return token;
}

export { createJwtToken };

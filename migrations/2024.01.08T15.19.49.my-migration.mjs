import { hash } from "bcrypt";

export const up = async ({ context: sequelize }) => {
  const hashedPass = await hash("admin", 10);
  await sequelize.getQueryInterface().bulkInsert("Users", [{
    name: "admin",
    email: "admin@exmaple.com",
    password: hashedPass,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {})
};

export const down = async params => {};

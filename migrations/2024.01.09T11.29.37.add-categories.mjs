/** @type {import('umzug').MigrationFn<any>} */
export const up = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("Users", [{
    name: "admin",
    email: "admin@exmaple.com",
    password: hashedPass,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {})
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async params => {};

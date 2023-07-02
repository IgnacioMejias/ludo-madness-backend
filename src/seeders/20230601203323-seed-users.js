const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword1 = await bcrypt.hash('1234', 10);
    const hashedPassword2 = await bcrypt.hash('5678', 10);

    return queryInterface.bulkInsert('Users', [
      {
        name: 'mejis',
        password: hashedPassword1,
        email: 'imejiass@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'fudi',
        password: hashedPassword2,
        email: 'rfuchslocher@uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};

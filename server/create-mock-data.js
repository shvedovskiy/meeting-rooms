const { 
  models: { User, Room, Event }, 
  sequelize, 
} = require('./models');

function createData() {
  const usersPromise = User.bulkCreate([{
    login: 'veged',
    avatarUrl: 'https://avatars3.githubusercontent.com/u/15365?s=460&v=4',
    homeFloor: 0,
  }, {
    login: 'alt-j',
    avatarUrl: 'https://avatars1.githubusercontent.com/u/3763844?s=400&v=4',
    homeFloor: 3,
  }, {
    login: 'yeti-or',
    avatarUrl: 'https://avatars0.githubusercontent.com/u/1813468?s=460&v=4',
    homeFloor: 2,
  }]);

  const roomsPromise = Room.bulkCreate([{
    title: '404',
    capacity: 5,
    floor: 4,
  }, {
    title: 'Деньги',
    capacity: 4,
    floor: 2,
  }, {
    title: 'Карты',
    capacity: 4,
    floor: 2,
  }, {
    title: 'Ствола',
    capacity: 2,
    floor: 2,
  }, {
    title: '14',
    capacity: 6,
    floor: 3,
  }]);

  const HOUR = 60 * 60 * 1000;
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + HOUR);
  const twoHoursLater = new Date(oneHourLater.getTime() + HOUR);
  const threeHoursLater = new Date(twoHoursLater.getTime() + HOUR);

  const eventsPromise = Event.bulkCreate([{
    title: 'ШРИ 2018 - начало',
    dateStart: now,
    dateEnd: oneHourLater,
  }, {
    title: '👾 Хакатон 👾',
    dateStart: oneHourLater,
    dateEnd: twoHoursLater,
  }, {
    title: '🍨 Пробуем kefir.js',
    dateStart: twoHoursLater,
    dateEnd: threeHoursLater,
  }]);

  Promise.all([usersPromise, roomsPromise, eventsPromise])
    .then(() => Promise.all([
      User.findAll(),
      Room.findAll(),
      Event.findAll(),
    ]))
    .then(([users, rooms, events]) => {
      const promises = [];
      
      promises.push(events[0].setRoom(rooms[0]));
      promises.push(events[1].setRoom(rooms[1]));
      promises.push(events[2].setRoom(rooms[2]));

      promises.push(events[0].setUsers([users[0], users[1]]));
      promises.push(events[1].setUsers([users[1], users[2]]));
      promises.push(events[2].setUsers([users[0], users[2]]));

      return Promise.all(promises);
    });
}

sequelize.sync()
  .then(createData)
  .catch(error => 
    console.error('Did you enter wrong database credentials?', `(${error})`)
  );

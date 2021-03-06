const request = require('supertest');

const server = require('./server.js');

describe('server', () => {
  describe('Get /games', () => {
    it('the get is getting a status code of 200(OK)', async () => {
      const response = await request(server).get('/games');

      expect(response.status).toBe(200);
    });

    it('the get is recieving an array even if it is empty', async () => {
      const response = await request(server).get('/games');

      expect(response.body).toEqual(expect.arrayContaining([]));
    });

    it('the get is recieving the list of games', async () => {
      const response = await request(server).get('/games');

      expect(response.body.games.length).toBeGreaterThan(-1);
    });

    it('should return json', async () => {
      const response = await request(server).get('/games');

      expect(response.type).toBe('application/json');
    });
  });

  describe('POST /games', () => {
    // beforeEach(() => {
    //   console.log('hi');
    // });

    it('post sends a status of 201(Created) when it is correct', async () => {
      const newGame = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1980,
      };

      const response = await request(server)
        .post('/games')
        .send(newGame);

      expect(response.status).toBe(201);
    });

    it('adds a new game into the array', async () => {
      const newGame = {
        title: 'Galatica',
        genre: 'Arcade',
        releaseYear: 1981,
      };

      const response = await request(server)
        .post('/games')
        .send(newGame);
      expect(response.body).toEqual(
        expect.arrayContaining([{ ...newGame, id: 11 }])
      );
    });

    describe('status 422(Unprocessable Entity) returned if properties are missing', () => {
      it('genre is required', async () => {
        const newGame = {
          title: 'Prince of Persia',
        };

        const response = await request(server)
          .post('/games')
          .send(newGame);

        expect(response.status).toBe(422);
      });

      it('title is required', async () => {
        const newGame = {
          genre: 'Action',
        };

        const response = await request(server)
          .post('/games')
          .send(newGame);

        expect(response.status).toBe(422);
      });
    });

    it('is the game unique based on title if not 405(Not Allowed)', async () => {
      const newGame = {
        title: 'Spider-Man',
        genre: 'action-adventure',
        releaseYear: 2018,
      };

      const response = await request(server)
        .post('/games')
        .send(newGame);

      expect(response.status).toBe(405);
    });
  });

  it('server running', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });
});

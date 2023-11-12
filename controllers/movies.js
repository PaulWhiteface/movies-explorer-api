const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-400');
const ForbiddenError = require('../errors/forbidden-error-403');
const NotFoundError = require('../errors/not-found-error-404');

// Получаем все фильмы
module.exports.getMovies = (req, res, next) => {
  const ownerId = req.user.owner;

  Movie.find({ ownerId })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailerLink, nameRU,
    nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка, поля некорректно заполнены'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .then((item) => {
            res.status(200).send(item);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Некорректные данные'));
              return;
            }
            next(err);
          });
      } else {
        throw new ForbiddenError('Нет прав на удаление этого фильма');
      }
    })
    .catch(next);
};

const router = require('express').Router();

router.use('/scores', require('./scores'));

router.use(async (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;

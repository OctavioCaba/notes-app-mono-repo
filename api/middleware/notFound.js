module.exports = (req, res) => {
  res.status(404).json({
    error: 'No se pudo encontrar la página'
  });
};

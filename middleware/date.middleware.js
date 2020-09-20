module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    if (req.body.date) {
      const regex = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/gm;
      const str = req.body.date;
      if (str.match(regex)) {
        req.customDate = str;
        next();
      } else {
        res.status(401).json({
          message:
            'Строка не соответсвует формату YYYY-MM-DD hh:mm:ss повторите ввод, либо уберите поле date, чтобы система сама установила необходимое время',
        });
      }
    } else {
      let date = '';
      const transacDate = new Date();
      date = date.concat(
        transacDate.toLocaleDateString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        ' ',
        transacDate.toLocaleTimeString('ru-RU', { hour12: false })
      );
      req.customDate = date;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Ошибка при вычислении времени запроса', error });
  }
};

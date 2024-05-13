const getHandler = (model) => async (req, res) => {
  try {
    const data = await model.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postHandler =
  (model, validator = (x) => [true, ""]) =>
  async (req, res) => {
    try {
      const fields = req.body;
      const [valid, msg] = validator(fields);
      
      if (valid) {
        const modelObj = await model.create(fields);
        res.status(200).json(modelObj);
      } else {
        res.status(400).json({ error: msg });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

export { getHandler, postHandler };

const sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    meta: data.meta || undefined,
    data: data.data,
  });
};

export default sendResponse;

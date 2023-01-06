const responseGenerator = (res) => {

  return (context, isSuccess = true) => {
    let response = {
      status: isSuccess ? 'success' : 'fail',
    }
    if (typeof(context) === 'object') response.data = context;
    if (typeof(context) === 'string') response.message = context;

    return res.json(response);
  };

}

module.exports = responseGenerator;
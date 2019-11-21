export const checkStatus = (res) => {
  const { status, body } = res;
  
  if (status == 200 || status == 304) return;

  const err = new Error("Status code error");
  err.status = status || 404;
  err.body = body || '';
}

export const checkLoginStatus = (res) => {
  const { status, body } = res;

  if (status == 200) return;

  body = JSON.stringify(body).toLowerCase();

  const error = new Error();
  if (body.includes("invalid email")) error.message = "Invalid credentials";
  else if (body.includes("account") && body.includes("hold")) error.message = "Account on hold!";
  else error.message = "Unknown login error!";

  error.status = status;

  throw error;
}

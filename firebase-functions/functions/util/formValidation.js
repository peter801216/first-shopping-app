//helping function
const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) {
    return true;
  } else {
    return false;
  }
};

const isCellphone = (phone) => {
  if (
    phone.length === 10 &&
    phone[0] === "0" &&
    phone[1] === "9" &&
    !isNaN(+phone) &&
    !phone.split("").includes(".")
  ) {
    return true;
  } else {
    return false;
  }
};

const isBankCode = (bankCode) => {
  if (
    bankCode.length === 3 &&
    !isNaN(bankCode) &&
    !bankCode.split("").includes(".")
  ) {
    return true;
  } else {
    return false;
  }
};

const checkAccountNumber = (accountNumber) => {
  if (
    accountNumber.length === 5 &&
    !isNaN(accountNumber) &&
    !accountNumber.split("").includes(".")
  ) {
    return true;
  } else {
    return false;
  }
};

exports.validateSignupData = (data) => {
  let errors = {};
  //姓名
  if (isEmpty(data.name)) {
    errors.name = "此欄為必填資料";
  }
  //信箱
  if (isEmpty(data.email)) {
    errors.email = "此欄為必填資料";
  } else if (!isEmail(data.email)) {
    errors.email = "請填入正確email";
  }
  //手機號碼
  if (isEmpty(data.phone)) {
    errors.phone = "此欄為必填資料";
  } else if (!isCellphone(data.phone)) {
    errors.phone = "請填入正確手機號碼";
  }
  //密碼
  if (isEmpty(data.password)) {
    errors.password = "此欄為必填資料";
  }
  //密碼確認
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "密碼不符，請輸入正確密碼";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};
  //手機號碼
  if (isEmpty(data.phone)) {
    errors.phone = "請輸入手機號碼";
  } else if (!isCellphone(data.phone)) {
    errors.phone = "請填入正確手機號碼";
  }
  //密碼
  if (isEmpty(data.password)) {
    errors.password = "請輸入密碼";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateUserInfo = (data) => {
  let errors = {};

  if (isEmpty(data.address)) {
    errors.address = "不得為空白";
  }

  if (isEmpty(data.bankCode)) {
    errors.bankCode = "不得為空白";
  } else if (isBankCode(data.bankCode)) {
    errors.bankCode = "請輸入正確銀行代碼";
  }

  if (isEmpty(data.accountNumber)) {
    errors.accountNumber = "不得為空白";
  } else if (checkAccountNumber(data.accountNumber)) {
    errors.accountNumber = "請輸匯款帳戶末五碼";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

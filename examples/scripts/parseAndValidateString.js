const parseAndValidateString = (() => {
  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const parseDMS = (e) => {
    const stringInput = document.querySelector("input[name=dms_string]");
    const decimalOutput = document.querySelector("input[name=d_output]");

    e.preventDefault();

    stringInput.classList.remove("input---error");
    decimalOutput.classList.remove("input---error");

    try {
      const parsedValue = geo.parseDMS(stringInput.value);
      decimalOutput.value = parsedValue;
    } catch (err) {
      stringInput.classList.add("input---error");
      decimalOutput.classList.add("input---error");
      decimalOutput.value = err;
    }
  };

  const init = (() => {
    document.getElementById("pvs_parseDMS").addEventListener("click", parseDMS);
    document
      .getElementById("pvs_dms_string")
      .addEventListener("focus", clearInputError);
  })();

  return {
    clearInputError,
    parseDMS,
  };
})();

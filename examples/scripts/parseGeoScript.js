const parseGeoScript = (() => {
  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const parseDMS = (e) => {
    e.preventDefault();

    const stringInput = document.querySelector("input[name=dms_string]");
    const decimalOutput = document.querySelector("input[name=d_output]");

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

    console.log("geo", stringInput, geo.parseDMS(stringInput));
    console.log("trigger", e);
  };

  return {
    clearInputError,
    parseDMS,
  };
})();

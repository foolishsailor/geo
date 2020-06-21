const parseAndValidateArray = (() => {
  const clearInputError = (e) => {
    e.target.classList.remove("input---error");
  };

  const parseDMS = (e) => {
    const stringInput = document.querySelector("textarea[name=dms_object]");
    const decimalOutput = document.querySelector("textarea[name=d_obj_output]");

    e.preventDefault();

    stringInput.classList.remove("input---error");
    decimalOutput.classList.remove("input---error");

    try {
      console.log("raw string", JSON.parse(stringInput.value));
      const parsedValue = geo.parseDMS(JSON.parse(stringInput.value));

      console.log("parsedValue", parsedValue);
      decimalOutput.value = JSON.stringify(parsedValue);
    } catch (err) {
      console.log("error", err);
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

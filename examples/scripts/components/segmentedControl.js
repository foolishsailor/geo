const segmentedControl = (elem, items) => {
  const segmentedControl = document.getElementById(elem);

  items.forEach((item, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.setAttribute("for", item);
    label.innerHTML = item;
    input.setAttribute("type", "radio");
    input.setAttribute("id", item);
    input.setAttribute("name", elem);
    input.setAttribute("value", item);

    if (i === 0) input.checked = true;

    segmentedControl.appendChild(input);
    segmentedControl.appendChild(label);
  });
};

export default segmentedControl;

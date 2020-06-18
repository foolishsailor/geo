const loader = async (htmlSrc, scriptSrc) => {
  try {
    const result = await fetch(`./components/${htmlSrc}.html`);
    const html = await result.text();
    const elem = document.getElementById(htmlSrc);
    let script = document.createElement("script");

    if (scriptSrc) {
      script.src = `./scripts/${scriptSrc}.js`;
      document.head.appendChild(script);
    }

    elem.innerHTML = html;
  } catch (err) {
    console.log("load error", err);
  }
};

export default loader;

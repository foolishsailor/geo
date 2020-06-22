const loader = async (htmlSrc, scriptSrc) => {
  try {
    if (htmlSrc) {
      const result = await fetch(`./components/${htmlSrc}.html`);
      const html = await result.text();
      const elem = document.getElementById(htmlSrc);
      elem.innerHTML = html;
    }
    if (scriptSrc) {
      let script = document.createElement("script");
      script.src = `./scripts/${scriptSrc}.js`;
      script.type = "module";
      document.body.appendChild(script);
    }
  } catch (err) {
    console.log("load error", err);
  }
};

export default loader;

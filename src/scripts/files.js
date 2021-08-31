export function downloadFileHTML({ contents, name = 'download.txt', type = 'text/plain' }) {
  const _a = document.createElement('a');

  const htmlDocument = document.implementation.createHTMLDocument(name);
  htmlDocument.body.innerHTML = contents.innerHTML;
  let file;

  const removeEls = Array.from(
    htmlDocument.querySelectorAll("button, input, aside, footer, .Controls, #site-header, .Nav, a, .strip")
  );

  removeEls.forEach((el) => {
    el.parentNode.removeChild(el);
  });

  const pageContent = Array.from(htmlDocument.querySelectorAll(".page-content"));
  const grids = Array.from(htmlDocument.querySelectorAll(".default-grid"));
  const tables = Array.from(htmlDocument.querySelectorAll("table"));
  const main = Array.from(htmlDocument.querySelectorAll("main"));
  pageContent.forEach((el) => {
    el.setAttribute("style", "display: flex; justify-content: center;");
  });
  grids.forEach((el) => {
    el.setAttribute("style", "display: block;");
  });
  tables.forEach((el) => {
    el.setAttribute("style", "width: 100%;");
  });
  main.forEach((el) => {
    el.setAttribute("style", "margin-top: 2em; margin-bottom: 2em;");
  });

  file = new Blob(
    [`<!doctype HTML>${htmlDocument.documentElement.outerHTML}`],
    {
      type: "text/html",
    }
  );

  _a.href = URL.createObjectURL(file);

  _a.download = name;

  _a.click();
}

export function downloadFileJSON({ contents, name = 'download.txt', type = 'text/plain' }) {
  const _a = document.createElement('a');
  const file = new Blob([contents], { type });

  _a.href = URL.createObjectURL(file);
  _a.download = name;

  _a.click();
}

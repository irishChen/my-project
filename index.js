/*---- Form ----*/
const nameField = document.querySelector("#form_name");
const positionField = document.querySelector("#form_position");
const emailField = document.querySelector("#form_email");
const phoneField = document.querySelector("#form_phone");

/*---- Card ----*/
const nameCard = document.querySelector("#card_name");
const positionCard = document.querySelector("#card_position");
const emailLinkCard = document.querySelector("#card_email_link");
const phoneCard = document.querySelector("#card_phone");

const buttonCopy = document.querySelector(".button_copy");

/*---- script ----*/
const fields = [
  {
    fieldElement: nameField,
    cardElement: nameCard,
  },
  {
    fieldElement: positionField,
    cardElement: positionCard,
  },
  {
    fieldElement: emailField,
    cardElement: emailLinkCard,
  },
  {
    fieldElement: phoneField,
    cardElement: phoneCard,
  },
];

/*---- listener ----*/

fields.forEach((f) =>
  f.fieldElement.addEventListener("input", function (e) {
    const id = `#${e.target.getAttribute("id")}`;
    const value = e.target.value;

    changeField(id, f.cardElement, value);
  })
);

buttonCopy.addEventListener("click", getCardCopied);

/*---- utils ----*/
function changeField(id, cardElement, value) {
  const modifiedEmail = id === "#form_email";

  if (modifiedEmail) {
    cardElement.setAttribute("href", `mailto:${value}`);
  }

  cardElement.textContent = value;
}

async function getCardCopied() {
  let msg = "Copied !";

  try {
    const content = document.querySelector("#container").innerHTML;
    const blobInput = new Blob([content], { type: "text/html" });

    console.log(`Blob Size (for Clipboard API):${blobInput.size}`);

    const result = await navigator.permissions.query({
      name: "clipboard-write",
    });
    const { state } = result;
    if (state !== "granted")
      throw new Error(
        `Custom Error: permissions state is not granted. Current state is ${state}`
      );

    const clipboardItemInput = new ClipboardItem({
      "text/html": blobInput,
    });

    await navigator.clipboard.write([clipboardItemInput]);

    console.log("Copied with Clipboard API");
  } catch (e) {
    console.log(e);

    // For env that doesn't support Clipboard
    try {
      const table = document.querySelector("#signature");
      console.log(`HTML template string: ${table.innerHTML.length}`);

      const range = document.createRange();
      range.selectNode(table);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      const success = document.execCommand("copy");

      if (!success)
        throw new Error("Fail to execute [document.execCommand('copy')]");
      console.log("Copied with document.execCommand('copy')");
    } catch (e) {
      console.log(e);
      msg = "Fail to Copied";
    }
  }

  buttonCopy.textContent = msg;
}

/*---- init ----*/
window.onload = function () {
  const baseUrl = window.location.href.split("/").slice(0, -1).join("/");

  // find all img elements
  const images = document.querySelectorAll("img");

  // replace all img source with current domain
  images.forEach((img) => {
    const src = img.getAttribute("src");

    if (src.match(/^\.\//)) {
      img.setAttribute("src", `${baseUrl}${src.slice(1)}`);
    }
  });
};

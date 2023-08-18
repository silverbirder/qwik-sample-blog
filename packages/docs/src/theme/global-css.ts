import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
  "*": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "noto",
    fontSize: "base",
    lineHeight: 1.5,
    color: "text.main",
    backgroundColor: "bg.main",
    height: "100%",
  },
  "h1, h2, h3, h4, h5, h6": {
    margin: 0,
    fontWeight: "normal",
  },
  "h1, h2, h3": {
    fontSize: "4xl",
  },
  "h4, h5, h6": {
    fontSize: "2xl",
  },
  "h1, h2, h3, h4, h5, h6, p, ul, ol, dl, table, blockquote, pre, form, fieldset, iframe, hr":
    {
      margin: "1rem 0",
    },
  "ul, ol, dl": {
    listStyle: "inside",
    paddingLeft: "1.5rem",
  },
  "ol ol, ul ol": {
    listStyle: "lower-latin",
  },
  "ul ul, ul ol, ol ul, ol ol": {
    margin: 0,
  },
  blockquote: {
    margin: "1rem 0",
    padding: "0 1rem",
    borderLeft: "4px solid",
    backgroundColor: "bg.quote",
  },
  "blockquote:before, blockquote:after, q:before, q:after": {
    content: "none",
  },
  a: {
    color: "text.link",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
    "&:active": {
      color: "text.linkActive",
    },
    "&:focus": {
      outline: "none",
    },
  },
  img: {
    width: "100%",
    maxHeight: "512px",
    objectFit: "contain",
  },
  table: {
    borderCollapse: "collapse",
    borderSpacing: 0,
    border: "1px solid",
    "& thead": {
      verticalAlign: "bottom",
      borderBottom: "2px solid",
    },
    "& tbody": {
      verticalAlign: "top",
    },
    "& tr": {
      verticalAlign: "top",
      borderBottom: "1px solid",
    },
    "& th": {
      fontWeight: "bold",
    },
    "& td": {
      fontWeight: "normal",
    },
    "& caption": {
      textAlign: "left",
      fontWeight: "bold",
    },
  },
  "address, caption, cite, code, dfn, em, strong, var": {
    fontStyle: "normal",
    fontWeight: "normal",
  },
  "input, textarea, select, button": {
    margin: 0,
    padding: 0,
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    color: "inherit",
    "&:not(button)": {
      verticalAlign: "middle",
    },
    "&:is(button)": {
      cursor: "pointer",
    },
  },
});

function bodyItemsFromHtmlString(string) {
  let output = string.split("\n").map((line, index) => {
    if (line.trim()) {
      return '"' + line + '"';
    }
    return '""';
  });
  return output.join(",\n");
}

function styleJSON(title, bodyItems) {
  return `\"${title.trim()}\": {\n\t\"prefix\": \"${title}\",\n\t\"body\": [${bodyItems}\n\t]\n},`;
}

function replaceQuotes(string) {
  return string.replace(/"/gi, '\\"');
}

new Vue({
  data() {
    return {
      message: "Title: ",
      input: "",
      output: ""
    };
  },
  methods: {
    foo() {
      this.output = styleJSON(
        "foo",
        bodyItemsFromHtmlString(replaceQuotes(this.input))
      );
    }
  }
}).$mount("#app");

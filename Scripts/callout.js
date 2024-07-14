// 这个脚本用来将来自obsidian中的callout语法转换为html的callout
function parseCallouts(markdown) {
  const calloutRegex = /> \[!(\w+)\]([\s\S]*?)(?=\n\n|\Z)/gm;
  return markdown.replace(calloutRegex, (match, type, content) => {
    // 去除内容中的所有行首的 `>`
    content = content.replace(/^\s*>\s*/gm, '');
    // 将匹配到的 callout 转换为 HTML
    return `<div class="callout ${type}">\n<strong>${type}</strong>\n${content.trim()}</div>\n`;
  });
}

window.onload = parseCallouts;
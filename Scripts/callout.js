// 定义解析callout的函数
function parseCallouts(markdown) {
  const calloutRegex = /> \[!(\w+)\]([\s\S]*?)(?=\n\n|\Z)/gm;
  return markdown.replace(calloutRegex, (match, type, content) => {
    // 将行首的'>'替换为'\n'
    content = content.replace(/^\s*>\s*/gm, '\n');
    // 将匹配到的 callout 转换为 HTML
    return `<div class="callout ${type}">\n<strong>${type}</strong>\n${content.trim()}</div>\n`;
  });
}

// 替换页面上所有匹配callout的正则表达式内容
function replaceCalloutsInPage() {
  // 获取页面上所有的文本节点
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node = walker.nextNode();

  while (node) {
    if (node.nodeType === 3) { // 文本节点
      const text = node.nodeValue;
      const newHtml = parseCallouts(text);
      if (newHtml !== text) {
        // 创建一个临时的div来安全地解析HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHtml;
        // 替换原始文本节点
        node.parentNode.replaceChild(tempDiv, node);
        // 将新创建的div扁平化，以保持DOM结构的简洁性
        flattenNode(tempDiv);
      }
    }
    node = walker.nextNode();
  }
}

// 扁平化节点，将所有子节点移动到父节点
function flattenNode(node) {
  let child = node.firstChild;
  while (child) {
    const nextChild = child.nextSibling;
    if (child.nodeType === 3) { // 文本节点
      node.parentNode.insertBefore(child, node);
    } else {
      flattenNode(child); // 递归扁平化子节点
    }
    child = nextChild;
  }
  node.parentNode.removeChild(node);
}

// 在文档加载完毕后执行替换
document.addEventListener('DOMContentLoaded', replaceCalloutsInPage);

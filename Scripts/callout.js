// 当文档加载完毕后执行替换操作
document.addEventListener('DOMContentLoaded', function() {
  // 创建一个TreeWalker来遍历所有文本节点
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  var node;
  
  var calloutRegex = /> \[!(\w+)\]([\s\S]*?)(?=\n\n|\Z)/gm;
  // 遍历所有文本节点
  while ((node = walker.nextNode())) {
    // 检查节点类型是否为文本节点
    if (node.nodeType === 3) { // Node.TEXT_NODE
      // 替换文本节点中的所有'1'为'2'
      node.nodeValue = node.nodeValue.replace(calloutRegex, (match, type, content) => {
        content = content.replace(/^\s*>\s*/gm, '\n');
        return `<div class="callout ${type}">\n<strong>${type}</strong>\n${content.trim()}</div>\n`;
      });
    }
  }
});

// 处理数学公式显示
document.addEventListener("DOMContentLoaded", function() {
    // 等待页面完全加载
    setTimeout(function() {
        // 寻找所有的数学公式块 ($$...$$)
        const content = document.querySelector('.post-content');
        if (!content) return;
        
        // 在页面上查找所有纯文本的$$ (不在pre或code标签内)
        const textNodes = [];
        const walk = document.createTreeWalker(
            content, 
            NodeFilter.SHOW_TEXT, 
            {
                acceptNode: function(node) {
                    // 跳过pre和code标签内的文本
                    if (node.parentNode.nodeName === 'PRE' || 
                        node.parentNode.nodeName === 'CODE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只处理包含$$的文本节点
                    if (node.textContent.includes('$$')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
        
        // 收集包含$$的文本节点
        let node;
        while (node = walk.nextNode()) {
            textNodes.push(node);
        }
        
        // 处理文本节点
        textNodes.forEach(function(textNode) {
            const text = textNode.textContent;
            // 使用正则表达式查找并替换$$...$$模式
            const newText = text.replace(/\$\$([\s\S]*?)\$\$/g, function(match, formula) {
                // 使用div包裹数学公式
                return `<div class="math-formula">$$${formula}$$</div>`;
            });
            
            // 如果有变化，创建新的HTML并替换原节点
            if (text !== newText) {
                const temp = document.createElement('div');
                temp.innerHTML = newText;
                
                // 将新创建的节点插入到原节点位置
                const parent = textNode.parentNode;
                const children = Array.from(temp.childNodes);
                children.forEach(child => parent.insertBefore(child, textNode));
                parent.removeChild(textNode);
            }
        });
        
        // 重新触发KaTeX渲染
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }, 100);
}); 